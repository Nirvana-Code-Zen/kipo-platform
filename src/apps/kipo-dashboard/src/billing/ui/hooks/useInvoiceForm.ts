"use client"

import { useState, useMemo } from "react"

import type { UIInvoice, VoucherType } from "../components/shared/types"
import type { CreateInvoiceApiRequest } from "../../core/application/dtos/InvoiceApiDTO"

export type ConceptFormItem = {
  id: string
  description: string
  quantity: string
  unitPrice: string
  productServiceCode: string
  unitCode: string
  taxObject: string
  ivaRate: string
}

export type InvoiceFormErrors = {
  voucherType?: string
  paymentMethod?: string
  paymentForm?: string
  currency?: string
  issuerZipCode?: string
  exportType?: string
  receiverTaxId?: string
  receiverName?: string
  receiverZip?: string
  concepts?: string
  items?: Partial<Record<keyof ConceptFormItem, string>>[]
}

function emptyConceptItem(): ConceptFormItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: "1",
    unitPrice: "",
    productServiceCode: "",
    unitCode: "E48",
    taxObject: "02",
    ivaRate: "16",
  }
}

function roundMxn(n: number) {
  return Math.round(n * 100) / 100
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
}

export function useInvoiceForm() {
  const [voucherType, setVoucherType] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentForm, setPaymentForm] = useState("")
  const [currency, setCurrency] = useState("MXN")
  const [exportType, setExportType] = useState("01")
  const [issuerZipCode, setIssuerZipCode] = useState("")

  const [receiverTaxId, setReceiverTaxId] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverZip, setReceiverZip] = useState("")
  const [customerId, setCustomerId] = useState<string | null>(null)

  const [concepts, setConcepts] = useState<ConceptFormItem[]>([emptyConceptItem()])

  const [errors, setErrors] = useState<InvoiceFormErrors>({})

  const addConcept = () => setConcepts((prev) => [...prev, emptyConceptItem()])

  const removeConcept = (id: string) =>
    setConcepts((prev) => prev.filter((c) => c.id !== id))

  const updateConcept = (id: string, field: keyof ConceptFormItem, value: string) =>
    setConcepts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )

  const totals = useMemo(() => {
    let subtotal = 0
    let iva = 0
    for (const c of concepts) {
      const qty = parseFloat(c.quantity) || 0
      const price = parseFloat(c.unitPrice) || 0
      const amount = roundMxn(qty * price)
      subtotal += amount
      if (c.taxObject === "02" && c.ivaRate !== "exento") {
        iva += roundMxn(amount * (parseFloat(c.ivaRate) / 100))
      }
    }
    return { subtotal: roundMxn(subtotal), iva: roundMxn(iva), total: roundMxn(subtotal + iva) }
  }, [concepts])

  function validate(): boolean {
    const next: InvoiceFormErrors = {}

    if (!voucherType) next.voucherType = "Selecciona el tipo de comprobante"
    if (!paymentMethod) next.paymentMethod = "Selecciona el método de pago"
    if (paymentMethod && paymentMethod !== "PPD" && !paymentForm) next.paymentForm = "Selecciona la forma de pago"
    if (!currency) next.currency = "Selecciona la moneda"
    if (!/^\d{5}$/.test(issuerZipCode.trim())) next.issuerZipCode = "5 dígitos requeridos"
    const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
    const taxId = receiverTaxId.trim().toUpperCase()
    if (!taxId) {
      next.receiverTaxId = "RFC del receptor requerido"
    } else if (!RFC_REGEX.test(taxId)) {
      next.receiverTaxId = "RFC inválido (ej. XAXX010101000)"
    }
    if (!receiverName.trim()) next.receiverName = "Nombre del receptor requerido"
    if (!/^\d{5}$/.test(receiverZip.trim())) next.receiverZip = "C.P. receptor requerido (5 dígitos)"

    if (concepts.length === 0) {
      next.concepts = "Agrega al menos un concepto"
    } else {
      const itemErrors: InvoiceFormErrors["items"] = concepts.map((c) => {
        const err: Partial<Record<keyof ConceptFormItem, string>> = {}
        if (!c.description.trim()) err.description = "Requerido"
        const qty = parseFloat(c.quantity)
        if (!c.quantity || isNaN(qty) || qty <= 0) err.quantity = "Mayor a 0"
        const price = parseFloat(c.unitPrice)
        if (c.unitPrice === "" || isNaN(price) || price < 0) err.unitPrice = "Requerido"
        if (!c.productServiceCode.trim()) err.productServiceCode = "Requerido"
        return err
      })
      if (itemErrors.some((e) => Object.keys(e).length > 0)) next.items = itemErrors
    }

    setErrors(next)
    const itemsOk = !next.items || next.items.every((e) => Object.keys(e).length === 0)
    return Object.keys(next).filter((k) => k !== "items").length === 0 && itemsOk
  }

  function buildInvoice(): UIInvoice {
    const resolvedPaymentForm = paymentMethod === "PPD" ? "99" : paymentForm

    const now = new Date()
    return {
      id: crypto.randomUUID(),
      folio: "—",
      status: "draft",
      issuedAt: formatDate(now),
      issuedAtISO: now.toISOString().slice(0, 10),
      receiverName: receiverName.trim(),
      receiverTaxId: receiverTaxId.trim().toUpperCase(),
      subtotal: totals.subtotal,
      iva: totals.iva,
      total: totals.total,
      currency,
      voucherType: voucherType as VoucherType,
      paymentMethod,
      paymentForm: resolvedPaymentForm,
      concepts: concepts.map((c) => {
        const qty = parseFloat(c.quantity) || 0
        const price = parseFloat(c.unitPrice) || 0
        const amount = Math.round(qty * price * 100) / 100
        const ivaRate = c.taxObject === "02" && c.ivaRate !== "exento" ? parseFloat(c.ivaRate) : null
        const ivaAmount = ivaRate !== null ? Math.round(amount * ivaRate / 100 * 100) / 100 : 0
        return {
          productServiceCode: c.productServiceCode.trim(),
          unitCode: c.unitCode,
          description: c.description.trim(),
          quantity: qty,
          unitPrice: price,
          amount,
          taxObject: c.taxObject,
          ivaRate,
          ivaAmount,
        }
      }),
    }
  }

  function buildCreateRequest(): CreateInvoiceApiRequest {
    const resolvedPaymentForm = paymentMethod === "PPD" ? "99" : paymentForm
    return {
      voucher_type: voucherType,
      payment_method: paymentMethod,
      payment_form: resolvedPaymentForm,
      currency,
      export_type: exportType,
      issuer_zip: issuerZipCode.trim(),
      customer_id: customerId,
      receiver: {
        tax_id: receiverTaxId.trim().toUpperCase(),
        name: receiverName.trim(),
        zip: receiverZip.trim(),
      },
      concepts: concepts.map((c) => ({
        product_service_code: c.productServiceCode.trim(),
        unit_code: c.unitCode,
        description: c.description.trim(),
        quantity: parseFloat(c.quantity) || 0,
        unit_price: parseFloat(c.unitPrice) || 0,
        tax_object: c.taxObject,
        iva_rate: c.taxObject === "02" && c.ivaRate !== "exento" ? parseFloat(c.ivaRate) : null,
      })),
    }
  }

  return {
    voucherType, setVoucherType,
    paymentMethod, setPaymentMethod,
    paymentForm, setPaymentForm,
    currency, setCurrency,
    exportType, setExportType,
    issuerZipCode, setIssuerZipCode,
    receiverTaxId, setReceiverTaxId,
    receiverName, setReceiverName,
    receiverZip, setReceiverZip,
    customerId, setCustomerId,
    concepts,
    addConcept,
    removeConcept,
    updateConcept,
    totals,
    errors,
    validate,
    buildInvoice,
    buildCreateRequest,
  }
}
