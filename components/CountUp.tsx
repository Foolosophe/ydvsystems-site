"use client"

import { useRef, useEffect } from "react"

export function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function animate() {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      const startTime = performance.now()

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const value = Math.round(eased * end)
        if (ref.current) {
          ref.current.textContent = value.toLocaleString("fr-FR") + suffix
        }
        if (progress < 1) {
          rafId.current = requestAnimationFrame(tick)
        }
      }

      rafId.current = requestAnimationFrame(tick)
    }

    function startObserving() {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el!)
      return observer
    }

    // Wait for loading screen to finish before observing
    const splash = document.getElementById("__splash")
    if (splash) {
      const mo = new MutationObserver(() => {
        if (!document.getElementById("__splash")) {
          mo.disconnect()
          startObserving()
        }
      })
      mo.observe(document.body, { childList: true, subtree: true })
      return () => {
        mo.disconnect()
        if (rafId.current) cancelAnimationFrame(rafId.current)
      }
    }

    // No loading screen — observe immediately
    const observer = startObserving()
    return () => {
      observer.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [end, suffix, duration])

  return (
    <span ref={ref} translate="no" className="notranslate" aria-live="polite" aria-atomic="true">
      0{suffix}
    </span>
  )
}
