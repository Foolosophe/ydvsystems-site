"use client"

import { useEffect, useRef, useCallback } from "react"

interface DraftAutoSaveProps {
  articleId: number | null
  title: string
  content: string
  category: string
  interval?: number
}

export default function DraftAutoSave({
  articleId,
  title,
  content,
  category,
  interval = 30000,
}: DraftAutoSaveProps) {
  const lastSaved = useRef({ title, content, category })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savingRef = useRef(false)

  const save = useCallback(async () => {
    if (savingRef.current) return
    if (
      title === lastSaved.current.title &&
      content === lastSaved.current.content &&
      category === lastSaved.current.category
    ) {
      return
    }

    savingRef.current = true
    const snapshot = { title, content, category }

    try {
      const res = await fetch("/api/admin/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, title, content, category }),
      })
      if (res.ok) {
        lastSaved.current = snapshot
      }
    } catch {
      // Silencieux — on reessaiera au prochain cycle
    } finally {
      savingRef.current = false
    }
  }, [articleId, title, content, category])

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(save, interval)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [save, interval])

  return null
}
