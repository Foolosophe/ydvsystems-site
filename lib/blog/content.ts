/**
 * Converts the legacy string[] blog content format (from messages/fr.json)
 * into sanitized HTML. Used exclusively by the seed migration.
 */
export function blocksToHtml(blocks: string[]): string {
  const htmlParts: string[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.startsWith("### ")) {
      htmlParts.push(`<h3>${escapeHtml(block.slice(4))}</h3>`)
    } else if (block.startsWith("## ")) {
      htmlParts.push(`<h2>${escapeHtml(block.slice(3))}</h2>`)
    } else if (block.startsWith("```")) {
      // Code block: content is inline with backticks in a single string
      // Format: "```typescript\ncode\nmore code\n```"
      const content = block.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "")
      htmlParts.push(`<pre><code>${escapeHtml(content)}</code></pre>`)
    } else {
      htmlParts.push(`<p>${escapeHtml(block)}</p>`)
    }

    i++
  }

  return htmlParts.join("\n")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
