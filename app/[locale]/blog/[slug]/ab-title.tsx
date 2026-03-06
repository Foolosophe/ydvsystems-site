"use client"

import { useEffect, useState } from "react"

export function ABTitle({ articleId, fallbackTitle }: { articleId: number; fallbackTitle: string }) {
  const [title, setTitle] = useState(fallbackTitle)
  const [variantId, setVariantId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/ab?articleId=${articleId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setTitle(json.data.title)
          setVariantId(json.data.variantId)
        }
      })
      .catch(() => {
        // Fallback au titre par defaut
      })
  }, [articleId])

  function handleClick() {
    if (variantId) {
      fetch("/api/ab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      }).catch(() => {})
    }
  }

  return (
    <h1
      className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight"
      onClick={handleClick}
    >
      {title}
    </h1>
  )
}
