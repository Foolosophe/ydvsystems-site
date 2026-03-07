import { List } from "lucide-react"

interface TocItem {
  level: number
  text: string
  id: string
}

function extractHeadings(html: string): TocItem[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
  const items: TocItem[] = []
  let match

  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim()
    if (!text) continue
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    items.push({ level: parseInt(match[1]), text, id })
  }

  return items
}

interface Props {
  content: string
  title: string
}

export function TableOfContents({ content, title }: Props) {
  const headings = extractHeadings(content)

  if (headings.length < 3) return null

  return (
    <nav className="mb-10 p-5 bg-secondary border border-border rounded-xl">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <List size={16} />
        {title}
      </p>
      <ul className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={i} className={h.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${h.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Adds id attributes to h2/h3 tags in HTML content for anchor linking.
 */
export function addHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, "").trim()
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    if (attrs.includes("id=")) return match
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`
  })
}
