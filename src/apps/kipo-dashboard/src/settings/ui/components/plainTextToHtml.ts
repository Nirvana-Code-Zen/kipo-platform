// Conversión entre la experiencia de texto plano que ve el usuario y el HTML
// restringido (`customSectionHtml`) que se persiste y se sanitiza de forma
// autoritativa en el backend (ver pdfCustomizationConstants.ts para la lista
// de tags permitidos). plainTextToHtml es una transformación de string pura
// (segura en SSR/módulo). htmlToPlainText necesita DOM (DOMParser), así que
// solo debe llamarse en cliente, dentro de efectos o handlers — nunca a nivel
// de módulo ni durante SSR.

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

export function plainTextToHtml(text: string): string {
  const normalized = text.replace(/\r\n?/g, '\n')
  const blankLinesNormalized = normalized
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : line))
    .join('\n')
  const trimmed = blankLinesNormalized.trim()
  if (!trimmed) return ''

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  return paragraphs
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

const BLOCK_TAGS = new Set([
  'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'li', 'ul', 'ol',
])

export function htmlToPlainText(html: string): string {
  if (!html || !html.trim()) return ''

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const lines: string[] = ['']

  function appendText(text: string) {
    if (!text) return
    lines[lines.length - 1] += text
  }
  function breakLine() {
    if (lines[lines.length - 1] !== '') lines.push('')
  }
  function breakParagraph() {
    breakLine()
    lines.push('')
  }
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(node.textContent ?? '')
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const element = node as Element
    const tag = element.tagName.toLowerCase()
    if (tag === 'br') { breakLine(); return }
    if (tag === 'script' || tag === 'style') return
    const isBlock = BLOCK_TAGS.has(tag)
    const isCell = tag === 'th' || tag === 'td'
    if (isBlock) breakParagraph()
    for (const child of Array.from(element.childNodes)) walk(child)
    if (isCell) appendText(' ')
    if (isBlock) breakParagraph()
  }
  for (const child of Array.from(doc.body.childNodes)) walk(child)

  return lines
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
