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

export function LoadingScreenWrapper() {
  const [mounted, setMounted] = useState(false)
  const [skip, setSkip] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const alreadyLoaded = localStorage.getItem("ydv_loaded") === "1"
    const isBlogArticle = /\/blog\/.+/.test(pathname)
    const isAdmin = /\/admin/.test(pathname)

    if (alreadyLoaded || isBlogArticle || isAdmin) {
      document.getElementById("__splash")?.remove()
      localStorage.setItem("ydv_loaded", "1")
      setSkip(true)
    }
    setMounted(true)
  }, [pathname])

  if (!mounted || skip) return null
  return <LoadingScreen />
}
