"use client"

import { ExternalLink } from "lucide-react"

const UMAMI_SHARE_URL = "https://analytics.ydvsystems.com/share/ydvstats2026/ydvsystems.com"

export default function UmamiPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] -m-8">
      <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics site</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dashboard Umami complet
          </p>
        </div>
        <a
          href={UMAMI_SHARE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
        >
          <ExternalLink size={14} />
          Ouvrir dans Umami
        </a>
      </div>
      <iframe
        src={UMAMI_SHARE_URL}
        className="flex-1 w-full border-0"
        title="Umami Analytics"
      />
    </div>
  )
}
