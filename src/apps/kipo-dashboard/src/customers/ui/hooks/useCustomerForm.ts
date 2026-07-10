"use client"

import { useState } from "react"

import { detectRfcType, RFC_TYPE_LABEL } from "@/src/shared/domain/rfc"

import { createLegalName } from "../../core/domain/value-objects/LegalName"
import { createTaxRegime } from "../../core/domain/value-objects/TaxRegime"
import { createZipCode } from "../../core/domain/value-objects/ZipCode"
import { createCfdiUsage } from "../../core/domain/value-objects/CfdiUsage"
import { createEmail } from "../../core/domain/value-objects/Email"
import { getInitials } from "../../core/domain/value-objects/AvatarUrl"
import { TAX_REGIMES } from "../data/catalogs"

import type { Customer as UICustomer } from "../components/types"

export type { RfcType } from "@/src/shared/domain/rfc"

export { detectRfcType, RFC_TYPE_LABEL }

export interface CustomerFormErrors {
  legalName?: string
  taxId?: string
  email?: string
  taxRegime?: string
  zipCode?: string
  cfdiUsage?: string
}

interface UseCustomerFormOptions {
  initialValues?: UICustomer
}

export function useCustomerForm({ initialValues }: UseCustomerFormOptions = {}) {
  const [legalName, setLegalName] = useState(initialValues?.legalName ?? "")
  const [taxId, setTaxId] = useState(initialValues?.taxId ?? "")
  const [email, setEmail] = useState(initialValues?.email ?? "")
  const [phone, setPhone] = useState(initialValues?.phone ?? "")
  const [taxRegime, setTaxRegime] = useState(() => {
    if (!initialValues?.taxRegime) return ""
    return TAX_REGIMES.find((r) => r.label === initialValues.taxRegime)?.code ?? initialValues.taxRegime
  })
  const [zipCode, setZipCode] = useState(initialValues?.zipCode ?? "")
  const [cfdiUsage, setCfdiUsage] = useState(initialValues?.cfdiUsage ?? "")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialValues?.avatar || null)
  const [activeStatus, setActiveStatus] = useState(initialValues?.status !== "inactive")
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  const rfcType = detectRfcType(taxId)
  const isGenericRfc = rfcType === "general" || rfcType === "foreign"
  const initials = getInitials(legalName)

  function validate(): boolean {
    const next: CustomerFormErrors = {}
    if (!createLegalName(legalName).ok) next.legalName = "Requerido, máximo 254 caracteres"
    if (rfcType === "invalid") next.taxId = "RFC inválido"
    if (rfcType === "empty") next.taxId = "RFC requerido"
    if (!createEmail(email).ok) next.email = "Correo inválido"
    if (!isGenericRfc && !createTaxRegime(taxRegime).ok) next.taxRegime = "Selecciona un régimen"
    if (!createZipCode(zipCode).ok) next.zipCode = "Código postal inválido (5 dígitos)"
    if (!isGenericRfc && !createCfdiUsage(cfdiUsage).ok) next.cfdiUsage = "Selecciona un uso de CFDI"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function buildCustomer(): UICustomer {
    const regimeLabel = TAX_REGIMES.find((r) => r.code === taxRegime)?.label ?? taxRegime
    return {
      id: initialValues?.id ?? "",
      taxId: taxId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      status: activeStatus ? "active" : "inactive",
      legalName: legalName.trim(),
      taxRegime: regimeLabel,
      taxRegimeCode: taxRegime,
      zipCode,
      cfdiUsage: cfdiUsage || undefined,
      avatar: avatarUrl ?? "",
      initials,
    }
  }

  return {
    legalName,    setLegalName,
    taxId,        setTaxId,
    email,        setEmail,
    phone,        setPhone,
    taxRegime,    setTaxRegime,
    zipCode,      setZipCode,
    cfdiUsage,    setCfdiUsage,
    avatarUrl,    setAvatarUrl,
    activeStatus, setActiveStatus,
    rfcType,
    isGenericRfc,
    initials,
    errors,
    validate,
    buildCustomer,
  }
}
