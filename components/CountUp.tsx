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

    let observer: IntersectionObserver | null = null

    function startObserving() {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el!)
    }

    // Wait for loader to finish, then start observing viewport
    const onLoaderDone = () => startObserving()
    window.addEventListener("loaderDone", onLoaderDone, { once: true })

    // If loader already done (navigations without reload), start immediately
    if (!document.getElementById("__splash")) {
      window.removeEventListener("loaderDone", onLoaderDone)
      startObserving()
    }

    return () => {
      window.removeEventListener("loaderDone", onLoaderDone)
      observer?.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [end, suffix, duration])

  return (
    <span ref={ref} translate="no" className="notranslate" aria-live="polite" aria-atomic="true">
      0{suffix}
    </span>
  )
}
