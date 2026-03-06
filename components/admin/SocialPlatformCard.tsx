"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, RefreshCw, Loader2 } from "lucide-react"

interface SocialPlatformCardProps {
  platform: string
  content: string | { subject: string; body: string }
  articleUrl: string
  onRegenerate: (platform: string) => void
  regenerating?: boolean
}

const PLATFORM_CONFIG: Record<string, { label: string; color: string; shareUrl?: (text: string, url: string) => string }> = {
  FACEBOOK: {
    label: "Facebook",
    color: "text-blue-600",
    shareUrl: (_text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  INSTAGRAM: {
    label: "Instagram",
    color: "text-pink-500",
  },
  TWITTER: {
    label: "Twitter / X",
    color: "text-sky-500",
    shareUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  LINKEDIN: {
    label: "LinkedIn",
    color: "text-blue-700",
    shareUrl: (_text, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  EMAIL: {
    label: "Email",
    color: "text-amber-600",
    shareUrl: (text, _url) => {
      const [subject, ...bodyParts] = text.split("\n\n")
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyParts.join("\n\n"))}`
    },
  },
}

function normalizeContent(content: string | { subject: string; body: string }): string {
  if (typeof content === "string") return content
  return `${content.subject}\n\n${content.body}`
}

export default function SocialPlatformCard({
  platform,
  content,
  articleUrl,
  onRegenerate,
  regenerating,
}: SocialPlatformCardProps) {
  const [editedContent, setEditedContent] = useState(() => normalizeContent(content))
  const [copied, setCopied] = useState(false)
  const config = PLATFORM_CONFIG[platform] || { label: platform, color: "text-foreground" }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${editedContent}\n\n${articleUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    // Copy text + URL to clipboard, then open the platform
    await navigator.clipboard.writeText(`${editedContent}\n\n${articleUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (config.shareUrl) {
      window.open(config.shareUrl(editedContent, articleUrl), "_blank")
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className={`font-semibold text-sm ${config.color}`}>{config.label}</h4>
        <span className="text-xs text-muted-foreground">{editedContent.length} chars</span>
      </div>

      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={platform === "EMAIL" ? 8 : 4}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          <span>{copied ? "Copie" : "Copier"}</span>
        </button>
        {config.shareUrl && (
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ExternalLink size={14} />
            <span>Copier & ouvrir</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onRegenerate(platform)}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary transition-colors ml-auto disabled:opacity-50"
        >
          <span key={regenerating ? "loading" : "idle"}>
            {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </span>
          <span>{regenerating ? "Generation..." : "Regenerer"}</span>
        </button>
      </div>
    </div>
  )
}
