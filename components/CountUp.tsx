"use client"

import { useRef, useEffect, useCallback } from "react"

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
  const hasRun = useRef(false)

  const animate = useCallback(() => {
    const el = ref.current
    if (!el || hasRun.current) return
    hasRun.current = true

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = end.toLocaleString("fr-FR") + suffix
      return
    }

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
  }, [end, suffix, duration])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [animate])

  return (
    <span ref={ref} translate="no" className="notranslate" aria-live="polite" aria-atomic="true">
      0{suffix}
    </span>
  )
}
