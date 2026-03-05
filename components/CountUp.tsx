"use client"

import { useRef, useEffect, useState } from "react"

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
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip animation for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  useEffect(() => {
    if (!started) return

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [started, end, duration])

  // Format with space thousands separator (French style)
  const formatted = value.toLocaleString("fr-FR")

  return (
    <span ref={ref} aria-live="polite" aria-atomic="true">
      {formatted}{suffix}
    </span>
  )
}
