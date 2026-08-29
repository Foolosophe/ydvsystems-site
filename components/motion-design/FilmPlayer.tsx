"use client"

import { useRef, useState } from "react"
import { Play } from "lucide-react"

// Le bouton de lecture natif ne peut pas etre stylise : on superpose le notre.
// Le clic reste un geste utilisateur sur la page courante, donc le son part —
// contrairement a un demarrage automatique, que les navigateurs coupent.
export function FilmPlayer({
  src,
  poster,
  label,
  playLabel,
  fallback,
  autoHighlight = false,
}: {
  src: string
  poster: string
  label: string
  playLabel: string
  fallback: string
  autoHighlight?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function start() {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    void video.play().catch(() => {
      // Lecture refusee : on laisse les controles natifs prendre le relais.
    })
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-(--shadow-card-hover) bg-black">
      <div className="relative w-full pt-[56.25%]">
        <video
          ref={videoRef}
          controls={started}
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
          className="absolute inset-0 w-full h-full"
        >
          <source src={src} type="video/mp4" />
          <a href={src}>{fallback}</a>
        </video>

        {!started && (
          <button
            type="button"
            onClick={start}
            aria-label={playLabel}
            className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors group cursor-pointer"
          >
            <span
              className={`flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-foreground font-semibold text-base shadow-(--shadow-glow) transition-transform duration-200 group-hover:scale-105 ${
                autoHighlight ? "animate-pulse-glow" : ""
              }`}
            >
              <Play size={20} className="fill-current" />
              {playLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
