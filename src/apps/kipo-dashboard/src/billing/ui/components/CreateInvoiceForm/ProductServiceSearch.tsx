"use client"

import { useRef } from "react"

import { X } from "lucide-react"
import { Input } from "@kipo/ui-react"

import { useClickOutside } from "@/src/shared/ui/hooks/useClickOutside"

import { useProductServiceSearch } from "../../hooks/useProductServiceSearch"
import { MOCK_PRODUCT_SERVICE_CODES } from "../../data/mockProductServiceCodes"

import type { ProductServiceSearchProps } from "./types"

export function ProductServiceSearch({
  description,
  productServiceCode,
  errorDescription,
  errorCode,
  onChangeDescription,
  onSelectCode,
  onClearCode,
}: ProductServiceSearchProps) {
  const search = useProductServiceSearch(description)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => search.setIsOpen(false))

  const selected = MOCK_PRODUCT_SERVICE_CODES.find((p) => p.code === productServiceCode)
  const isSelected = !!productServiceCode

  return (
    <div className="grid grid-cols-2 gap-3">
      <div ref={dropdownRef} className="relative">
        <Input
          label="Descripción"
          placeholder="Servicio de desarrollo de software"
          value={description}
          onChange={(e) => {
            onChangeDescription(e.target.value)
            search.setIsOpen(true)
          }}
          onFocus={() => search.setIsOpen(true)}
          error={errorDescription}
          autoComplete="off"
        />

        {search.isOpen && search.suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden rounded-md border-[1.5px] border-input bg-card shadow-lg">
            {search.suggestions.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  onSelectCode(s.code)
                  onChangeDescription(s.description)
                  search.setIsOpen(false)
                }}
                className="flex w-full flex-col gap-0.5 border-0 border-b border-border-subtle bg-transparent px-3.5 py-2.5 text-left cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="text-[13px] font-semibold text-foreground">
                  {s.description}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {s.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isSelected ? (
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[13px] font-semibold text-foreground">
            Clave producto/servicio
          </label>
          <div className="flex items-center gap-2.5 rounded-md border-[1.5px] border-input bg-muted px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[13px] font-semibold text-foreground">
                {productServiceCode}
              </p>
              {selected && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {selected.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClearCode}
              className="flex h-6 w-6 items-center justify-center rounded-sm border-0 bg-transparent cursor-pointer text-muted-foreground"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[13px] font-semibold text-foreground">
            Clave producto/servicio
          </label>
          <div
            className={`box-border w-full rounded-md border-[1.5px] bg-muted px-3.5 py-3 font-sans text-[13px] text-muted-foreground ${
              errorCode ? "border-destructive" : "border-border-subtle"
            }`}
          >
            Escribe la descripción para elegir la clave SAT
          </div>
          {errorCode && (
            <span className="text-xs text-destructive">{errorCode}</span>
          )}
        </div>
      )}
    </div>
  )
}
