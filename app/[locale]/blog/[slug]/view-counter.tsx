"use client"

import { useEffect } from "react"

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog/${slug}`, { method: "PATCH" }).catch(() => {})
  }, [slug])

  return null
}
