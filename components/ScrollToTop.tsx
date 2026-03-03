"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations("common.accessibility")

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white border border-border shadow-(--shadow-card) flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-(--shadow-card-hover) transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label={t("scrollToTop")}
    >
      <ArrowUp size={16} />
    </button>
  )
}
