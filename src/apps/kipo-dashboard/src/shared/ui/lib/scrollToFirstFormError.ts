function scrollContainerHasOverflow(container: HTMLElement): boolean {
  return container.scrollHeight > container.clientHeight
}

export function scrollToFirstFormError(
  container: HTMLElement | null,
  fieldOrder: readonly string[],
  errors: Readonly<Record<string, string | undefined>>,
): void {
  if (!container || !scrollContainerHasOverflow(container)) return

  const firstField = fieldOrder.find((field) => Boolean(errors[field]))
  if (!firstField) return

  const target = container.querySelector<HTMLElement>(`[data-form-field="${firstField}"]`)
  if (!target) return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const offsetTop = targetRect.top - containerRect.top + container.scrollTop - 12

  container.scrollTo({
    top: Math.max(0, offsetTop),
    behavior: 'smooth',
  })
}
