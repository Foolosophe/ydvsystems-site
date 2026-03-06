"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return <LoadingScreen />
}
