"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const LoadingScreen = dynamic(
  () =>
    import("@/components/LoadingScreen").then((mod) => ({
      default: mod.LoadingScreen,
    })),
  { ssr: false }
)

// Persists across client-side navigations, resets on full page reload
let hasSkippedOnce = false

export function LoadingScreenWrapper() {
  const [mounted, setMounted] = useState(false)
  const [skip, setSkip] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const isBlogArticle = /\/blog\/.+/.test(pathname)
    const isAdmin = /\/admin/.test(pathname)

    if (isBlogArticle || isAdmin || hasSkippedOnce) {
      document.getElementById("__splash")?.remove()
      if (isBlogArticle || isAdmin) hasSkippedOnce = true
      setSkip(true)
    }
    setMounted(true)
  }, [pathname])

  if (!mounted || skip) return null
  return <LoadingScreen />
}
