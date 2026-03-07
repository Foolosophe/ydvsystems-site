"use client"

import { useEffect, useState } from "react"
import { Users, Eye, MousePointerClick, Clock, ExternalLink } from "lucide-react"

interface UmamiStats {
  pageviews: { value: number; prev: number }
  visitors: { value: number; prev: number }
  visits: { value: number; prev: number }
  bounces: { value: number; prev: number }
  totaltime: { value: number; prev: number }
}

interface UmamiPage {
  x: string
  y: number
}

interface UmamiData {
  stats: UmamiStats
  pages: UmamiPage[]
  period: string
}

const PERIODS = [
  { value: "24h", label: "24 heures" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
]

export default function UmamiPage() {
  const [data, setData] = useState<UmamiData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/admin/umami?period=${period}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setError(json.error)
          setData(null)
        } else {
          setData(json)
        }
      })
      .catch(() => setError("Impossible de contacter l'API"))
      .finally(() => setLoading(false))
  }, [period])

  const bounceRate =
    data && data.stats.visits.value > 0
      ? ((data.stats.bounces.value / data.stats.visits.value) * 100).toFixed(1)
      : "0"

  const avgTime =
    data && data.stats.visits.value > 0
      ? formatDuration(data.stats.totaltime.value / data.stats.visits.value)
      : "0s"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics site</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Statistiques visiteurs via Umami
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <a
            href={process.env.NEXT_PUBLIC_UMAMI_URL || "https://analytics.ydvsystems.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            Umami
          </a>
        </div>
      </div>

      {loading && (
        <p className="text-muted-foreground">Chargement...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Visiteurs"
              value={String(data.stats.visitors.value)}
              prev={data.stats.visitors.prev}
            />
            <StatCard
              icon={Eye}
              label="Pages vues"
              value={String(data.stats.pageviews.value)}
              prev={data.stats.pageviews.prev}
            />
            <StatCard
              icon={MousePointerClick}
              label="Taux de rebond"
              value={`${bounceRate}%`}
            />
            <StatCard
              icon={Clock}
              label="Duree moy."
              value={avgTime}
            />
          </div>

          <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Pages les plus visitees
            </h2>
            {data.pages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnee pour cette periode</p>
            ) : (
              <div className="space-y-3">
                {data.pages.map((page) => {
                  const maxViews = data.pages[0]?.y || 1
                  const pct = (page.y / maxViews) * 100
                  return (
                    <div key={page.x} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground truncate max-w-[70%]">
                          {page.x}
                        </span>
                        <span className="text-muted-foreground">{page.y} vues</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  prev,
}: {
  icon: typeof Users
  label: string
  value: string
  prev?: number
}) {
  const current = parseFloat(value.replace("%", ""))
  const diff = prev != null && prev > 0 ? ((current - prev) / prev) * 100 : null

  return (
    <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon size={16} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      {diff != null && (
        <p className={`text-xs mt-1 ${diff >= 0 ? "text-green-600" : "text-red-500"}`}>
          {diff >= 0 ? "+" : ""}
          {diff.toFixed(0)}% vs periode prec.
        </p>
      )}
    </div>
  )
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}
