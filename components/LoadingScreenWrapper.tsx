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
  const pathname = usePathname()

  // Disable loader on blog and admin pages
  const skipLoader = /\/blog\/.+/.test(pathname) || /\/admin/.test(pathname)

  useEffect(() => {
    if (skipLoader) {
      document.getElementById("__splash")?.remove()
      // Mark as loaded so the loader won't play on subsequent navigations
      localStorage.setItem("ydv_loaded", "1")
    }
    setMounted(true)
  }, [skipLoader])

  if (!mounted || skipLoader) return null
  return <LoadingScreen />
}
