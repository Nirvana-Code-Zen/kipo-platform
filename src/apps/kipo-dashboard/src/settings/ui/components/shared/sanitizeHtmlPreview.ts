import { PDF_CUSTOM_SECTION_ALLOWED_TAGS } from './pdfCustomizationConstants'

// Visual/UX aid only — not a security boundary. The backend independently
// re-sanitizes before persisting anything; this output is only ever
// rendered locally in the browser, never sent anywhere.
export function sanitizeHtmlPreview(html: string): string {
  const allowedTags = new Set<string>(PDF_CUSTOM_SECTION_ALLOWED_TAGS)
  const container = document.createElement('div')
  container.innerHTML = html

  sanitizeChildren(container, allowedTags)

  return container.innerHTML
}

function sanitizeChildren(parent: Element, allowedTags: Set<string>): void {
  const children = Array.from(parent.childNodes)

  for (const node of children) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue

    const element = node as Element
    const tagName = element.tagName.toLowerCase()

    sanitizeChildren(element, allowedTags)

    if (!allowedTags.has(tagName)) {
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element)
      }
      parent.removeChild(element)
      continue
    }

    for (const attribute of Array.from(element.attributes)) {
      element.removeAttribute(attribute.name)
    }
  }
}
