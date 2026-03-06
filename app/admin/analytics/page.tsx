"use client"

import { useEffect, useState } from "react"
import { BarChart3, Zap, DollarSign, Hash } from "lucide-react"

interface UsageSummary {
  totalCalls: number
  totalTokensIn: number
  totalTokensOut: number
  totalCost: number
  byAction: Record<string, { count: number; cost: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<UsageSummary | null>(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setData(json.data)
      })
  }, [days])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics IA</h1>
          <p className="text-sm text-muted-foreground mt-1">Usage et couts des generations IA</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value={7}>7 jours</option>
          <option value={30}>30 jours</option>
          <option value={90}>90 jours</option>
        </select>
      </div>

      {!data ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Hash} label="Appels IA" value={String(data.totalCalls)} />
            <StatCard icon={Zap} label="Tokens entree" value={formatNumber(data.totalTokensIn)} />
            <StatCard icon={BarChart3} label="Tokens sortie" value={formatNumber(data.totalTokensOut)} />
            <StatCard icon={DollarSign} label="Cout estime" value={`$${data.totalCost.toFixed(4)}`} />
          </div>

          <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Usage par type d&apos;action</h2>
            {Object.keys(data.byAction).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnee pour cette periode</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(data.byAction)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([action, stats]) => {
                    const pct = data.totalCalls > 0 ? (stats.count / data.totalCalls) * 100 : 0
                    return (
                      <div key={action} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{formatAction(action)}</span>
                          <span className="text-muted-foreground">
                            {stats.count} appels — ${stats.cost.toFixed(4)}
                          </span>
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

function StatCard({ icon: Icon, label, value }: { icon: typeof Hash; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon size={16} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    outline: "Generation plan",
    article_from_outline: "Generation article",
    article_legacy: "Generation simple",
    titles: "Suggestions titres",
    assist_reformulate: "Reformulation",
    assist_complete: "Completion",
    assist_shorten: "Raccourcissement",
    assist_expand: "Developpement",
    social: "Posts sociaux",
    seo: "Analyse SEO",
    translate: "Traduction",
    research: "Recherche",
    section_regen: "Regeneration section",
  }
  return map[action] || action
}
