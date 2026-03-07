"use client"

import { useEffect, useState } from "react"
import { Linkedin, Twitter, Facebook, LinkIcon, Check, Share2 } from "lucide-react"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  const url = `https://ydvsystems.com/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url })
    } catch {
      // L'utilisateur a annule le partage
    }
  }

  const links = [
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0A66C2]",
    },
    {
      label: "X",
      icon: Twitter,
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-foreground",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2]",
    },
  ]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silencieux
    }
  }

  return (
    <div className="flex items-center gap-3">
      {links.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${label}`}
          className={`p-2 rounded-lg border border-border text-muted-foreground ${color} hover:bg-secondary transition-all`}
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copier le lien"
        className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />}
      </button>
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          aria-label="Partager"
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
        >
          <Share2 size={16} />
        </button>
      )}
    </div>
  )
}
