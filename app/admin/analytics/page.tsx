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
  const [parkinson, setParkinson] = useState<UsageSummary | null>(null)
  const [days, setDays] = useState(30)
  const [activeTab, setActiveTab] = useState<"all" | "ydv" | "parkinson">("all")

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setData(json.data)
        if (json.parkinson) setParkinson(json.parkinson)
      })
  }, [days])

  // Fusionner les deux sources pour le mode "all"
  function getMergedData(): UsageSummary | null {
    if (activeTab === "ydv") return data
    if (activeTab === "parkinson") return parkinson
    if (!data && !parkinson) return null
    if (!data) return parkinson
    if (!parkinson) return data

    const mergedByAction: Record<string, { count: number; cost: number }> = {}
    for (const [action, stats] of Object.entries(data.byAction)) {
      mergedByAction[action] = { ...stats }
    }
    for (const [action, stats] of Object.entries(parkinson.byAction)) {
      if (mergedByAction[action]) {
        mergedByAction[action].count += stats.count
        mergedByAction[action].cost += stats.cost
      } else {
        mergedByAction[action] = { ...stats }
      }
    }

    return {
      totalCalls: data.totalCalls + parkinson.totalCalls,
      totalTokensIn: data.totalTokensIn + parkinson.totalTokensIn,
      totalTokensOut: data.totalTokensOut + parkinson.totalTokensOut,
      totalCost: data.totalCost + parkinson.totalCost,
      byAction: mergedByAction,
    }
  }

  const displayData = getMergedData()

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

      {/* Tabs pour filtrer par source */}
      <div className="flex gap-2">
        {(["all", "ydv", "parkinson"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              activeTab === tab
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-border text-secondary-foreground hover:border-primary/30 hover:bg-secondary"
            }`}
          >
            {tab === "all" ? "Tous les blogs" : tab === "ydv" ? "YdvSystems" : "Blog Parkinson"}
            {tab === "parkinson" && !parkinson && (
              <span className="ml-1 text-muted-foreground text-xs">(offline)</span>
            )}
          </button>
        ))}
      </div>

      {!displayData ? (
        <p className="text-muted-foreground">
          {activeTab === "parkinson" && !parkinson
            ? "Le blog Parkinson ne repond pas ou n'a pas encore de donnees d'usage IA."
            : "Chargement..."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Hash} label="Appels IA" value={String(displayData.totalCalls)} />
            <StatCard icon={Zap} label="Tokens entree" value={formatNumber(displayData.totalTokensIn)} />
            <StatCard icon={BarChart3} label="Tokens sortie" value={formatNumber(displayData.totalTokensOut)} />
            <StatCard icon={DollarSign} label="Cout estime" value={`$${displayData.totalCost.toFixed(4)}`} />
          </div>

          {/* Comparaison cote a cote si "all" */}
          {activeTab === "all" && data && parkinson && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-4">
                <h3 className="text-xs font-semibold text-muted-foreground mb-1">YdvSystems</h3>
                <p className="text-lg font-bold text-foreground">${data.totalCost.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">{data.totalCalls} appels</p>
              </div>
              <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-4">
                <h3 className="text-xs font-semibold text-muted-foreground mb-1">Blog Parkinson</h3>
                <p className="text-lg font-bold text-foreground">${parkinson.totalCost.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">{parkinson.totalCalls} appels</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Usage par type d&apos;action</h2>
            {Object.keys(displayData.byAction).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnee pour cette periode</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(displayData.byAction)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([action, stats]) => {
                    const pct = displayData.totalCalls > 0 ? (stats.count / displayData.totalCalls) * 100 : 0
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
    // YdvSystems actions
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
    // Parkinson blog actions
    reformulate: "Reformulation (Parkinson)",
    generate: "Generation paragraphe (Parkinson)",
    generate_retry: "Generation retry (Parkinson)",
    expand: "Expansion texte (Parkinson)",
    expand_retry: "Expansion retry (Parkinson)",
    theme_assist: "Assistance thematique (Parkinson)",
    transcribe: "Transcription vocale (Parkinson)",
  }
  return map[action] || action
}
