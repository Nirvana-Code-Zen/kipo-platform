"use client"

import { Button, Input } from "@kipo/ui-react"
import { CheckCircle2, Plus, Trash2 } from "lucide-react"

import { useCatalogs } from "@/src/catalogs/ui/hooks/useCatalogs"

import { VOUCHER_TYPES, CURRENCIES, EXPORT_TYPES, UNIT_CODES } from "../../data/catalogs"
import { StyledSelect } from "./StyledSelect"
import { SectionTitle } from "./SectionTitle"
import { ReceiverSearch } from "./ReceiverSearch"
import { ProductServiceSearch } from "./ProductServiceSearch"
import { TotalRow } from "./TotalRow"
import { formatMXN } from "./constants"

import type { CreateInvoiceFormProps } from "./types"

export function CreateInvoiceForm({ form, onFormSubmit, onCancel, isSubmitting, submitLabel = "Crear borrador" }: CreateInvoiceFormProps) {
  const { metodoPago, formaPago, objetoImp, ivaTasa } = useCatalogs()

  return (
    <form onSubmit={onFormSubmit} noValidate>
      <div className="flex flex-col gap-7">

        <section className="flex flex-col gap-4">
          <SectionTitle>Datos del comprobante</SectionTitle>

          <StyledSelect
            label="Tipo de comprobante"
            value={form.voucherType}
            onChange={form.setVoucherType}
            options={VOUCHER_TYPES}
            error={form.errors.voucherType}
          />

          <div className="grid grid-cols-2 gap-3">
            <StyledSelect
              label="Método de pago"
              value={form.paymentMethod}
              onChange={form.setPaymentMethod}
              options={metodoPago.map((m) => ({ code: m.code, label: `${m.code} - ${m.description}` }))}
              error={form.errors.paymentMethod}
            />
            {form.paymentMethod === "PPD" ? (
              <StyledSelect
                label="Forma de pago"
                value="99"
                onChange={() => {}}
                options={formaPago
                  .filter((f) => f.code === "99")
                  .map((f) => ({ code: f.code, label: `${f.code} - ${f.description}` }))}
                hint="Automático para PPD"
              />
            ) : (
              <StyledSelect
                label="Forma de pago"
                value={form.paymentForm}
                onChange={form.setPaymentForm}
                options={formaPago.map((f) => ({ code: f.code, label: `${f.code} - ${f.description}` }))}
                error={form.errors.paymentForm}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StyledSelect
              label="Moneda"
              value={form.currency}
              onChange={form.setCurrency}
              options={CURRENCIES}
              error={form.errors.currency}
            />
            <Input
              label="C.P. Emisor"
              placeholder="00000"
              value={form.issuerZipCode}
              onChange={(e) => form.setIssuerZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              error={form.errors.issuerZipCode}
              mono
              maxLength={5}
            />
          </div>

          <StyledSelect
            label="Tipo de exportación"
            value={form.exportType}
            onChange={form.setExportType}
            options={EXPORT_TYPES}
          />
        </section>

        <section className="flex flex-col gap-4">
          <SectionTitle>Receptor</SectionTitle>

          <ReceiverSearch
            receiverTaxId={form.receiverTaxId}
            receiverName={form.receiverName}
            receiverZip={form.receiverZip}
            isCustomerSelected={!!form.customerId}
            errorTaxId={form.errors.receiverTaxId}
            errorName={form.errors.receiverName}
            errorZip={form.errors.receiverZip}
            onSelectCustomer={(s) => {
              form.setCustomerId(s.id)
              form.setReceiverTaxId(s.taxId)
              form.setReceiverName(s.name)
              form.setReceiverZip(s.zip ?? "")
            }}
            onChangeTaxId={form.setReceiverTaxId}
            onChangeName={form.setReceiverName}
            onChangeZip={form.setReceiverZip}
            onClear={() => {
              form.setReceiverTaxId("")
              form.setReceiverName("")
              form.setReceiverZip("")
              form.setCustomerId(null)
            }}
          />
        </section>

        <section className="flex flex-col gap-4">
          <SectionTitle>Conceptos</SectionTitle>

          {form.errors.concepts && (
            <span className="text-[12px] text-destructive">{form.errors.concepts}</span>
          )}

          <div className="flex flex-col gap-3">
            {form.concepts.map((concept, idx) => {
              const itemErr = form.errors.items?.[idx] ?? {}
              const qty = parseFloat(concept.quantity) || 0
              const price = parseFloat(concept.unitPrice) || 0
              const amount = Math.round(qty * price * 100) / 100

              return (
                <div
                  key={concept.id}
                  className="border-[1.5px] border-[var(--border-soft)] rounded-md p-4 bg-muted flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-[0.04em]">
                      Concepto {idx + 1}
                    </span>
                    {form.concepts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => form.removeConcept(concept.id)}
                        className="flex items-center justify-center w-7 h-7 rounded-sm border-0 bg-transparent cursor-pointer text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <ProductServiceSearch
                    description={concept.description}
                    productServiceCode={concept.productServiceCode}
                    errorDescription={itemErr.description}
                    errorCode={itemErr.productServiceCode}
                    onChangeDescription={(v) => form.updateConcept(concept.id, "description", v)}
                    onSelectCode={(code) => form.updateConcept(concept.id, "productServiceCode", code)}
                    onClearCode={() => form.updateConcept(concept.id, "productServiceCode", "")}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Cantidad"
                      type="number"
                      placeholder="1"
                      value={concept.quantity}
                      onChange={(e) => form.updateConcept(concept.id, "quantity", e.target.value)}
                      error={itemErr.quantity}
                      mono
                      min="0.001"
                    />
                    <Input
                      label="Precio unitario"
                      type="number"
                      placeholder="0.00"
                      value={concept.unitPrice}
                      onChange={(e) => form.updateConcept(concept.id, "unitPrice", e.target.value)}
                      error={itemErr.unitPrice}
                      mono
                      prefix="$"
                      min="0"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <StyledSelect
                    label="Clave unidad"
                    value={concept.unitCode}
                    onChange={(v) => form.updateConcept(concept.id, "unitCode", v)}
                    options={UNIT_CODES}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <StyledSelect
                      label="Objeto de impuesto"
                      value={concept.taxObject}
                      onChange={(v) => form.updateConcept(concept.id, "taxObject", v)}
                      options={objetoImp.map((o) => ({ code: o.code, label: `${o.code} - ${o.description}` }))}
                    />
                    {concept.taxObject === "02" && (
                      <StyledSelect
                        label="IVA"
                        value={concept.ivaRate}
                        onChange={(v) => form.updateConcept(concept.id, "ivaRate", v)}
                        options={ivaTasa.map((i) => ({ code: i.code, label: i.description }))}
                      />
                    )}
                  </div>

                  {amount > 0 && (
                    <div className="flex justify-end">
                      <span className="text-[13px] font-semibold font-mono text-foreground">
                        Importe: {formatMXN(amount)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={form.addConcept}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 border-[1.5px] border-dashed border-input rounded-md bg-transparent cursor-pointer text-[13px] font-semibold font-sans text-[var(--brand)]"
          >
            <Plus size={14} />
            Agregar concepto
          </button>
        </section>

        <div className="rounded-md border-[1.5px] border-[var(--border-soft)] overflow-hidden">
          <TotalRow label="Subtotal" value={formatMXN(form.totals.subtotal)} />
          <TotalRow label="IVA"      value={formatMXN(form.totals.iva)} />
          <TotalRow label="Total"    value={formatMXN(form.totals.total)} bold />
        </div>

        <div className="flex gap-2.5 pt-1">
          <Button type="button" variant="secondary" size="md" full onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" full disabled={isSubmitting}>
            <CheckCircle2 size={15} />
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </div>

      </div>
    </form>
  )
}
