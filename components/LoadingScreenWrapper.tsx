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

// Le loader ne joue qu'une fois par visite : marque posee par LoadingScreen a la
// fin de l'animation (ou au skip). Sans cette lecture il rejouait a chaque
// chargement complet — arrivee par URL, rafraichissement, lien externe.
const SEEN_KEY = "ydv_loaded"

function dejaVuCetteVisite() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}

export function LoadingScreenWrapper() {
  const [mounted, setMounted] = useState(false)
  const [skip, setSkip] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const isBlogArticle = /\/blog\/.+/.test(pathname)
    const isAdmin = /\/admin/.test(pathname)

    if (isBlogArticle || isAdmin || hasSkippedOnce || dejaVuCetteVisite()) {
      document.getElementById("__splash")?.remove()
      if (isBlogArticle || isAdmin) hasSkippedOnce = true
      setSkip(true)
      window.dispatchEvent(new Event("loaderDone"))
    }
    setMounted(true)
  }, [pathname])

  if (!mounted || skip) return null
  return <LoadingScreen />
}
