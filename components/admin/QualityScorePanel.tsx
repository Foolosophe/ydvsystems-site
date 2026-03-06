"use client"

import { useMemo } from "react"
import { analyzeQuality, type QualityReport } from "@/lib/ai/quality"
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

interface QualityScorePanelProps {
  content: string
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-green-600"
  if (score >= 50) return "text-yellow-600"
  return "text-red-500"
}

function scoreBg(score: number): string {
  if (score >= 75) return "bg-green-500"
  if (score >= 50) return "bg-yellow-500"
  return "bg-red-500"
}

function IssueIcon({ type }: { type: string }) {
  if (type === "error") return <AlertCircle size={14} className="text-red-500 shrink-0" />
  if (type === "warning") return <AlertTriangle size={14} className="text-yellow-600 shrink-0" />
  return <Info size={14} className="text-blue-500 shrink-0" />
}

export default function QualityScorePanel({ content }: QualityScorePanelProps) {
  const report: QualityReport = useMemo(() => analyzeQuality(content), [content])

  if (!content || report.wordCount === 0) return null

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Score qualite</h3>
        <div className={`text-2xl font-bold ${scoreColor(report.score)}`}>
          {report.score}/100
        </div>
      </div>

      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreBg(report.score)}`}
          style={{ width: `${report.score}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-secondary rounded-lg px-3 py-2">
          <span className="text-muted-foreground">Lisibilite</span>
          <p className="font-semibold text-foreground">{report.readability}/100</p>
        </div>
        <div className="bg-secondary rounded-lg px-3 py-2">
          <span className="text-muted-foreground">Sous-titres</span>
          <p className="font-semibold text-foreground">{report.headingCount}</p>
        </div>
        <div className="bg-secondary rounded-lg px-3 py-2">
          <span className="text-muted-foreground">Paragraphes</span>
          <p className="font-semibold text-foreground">{report.paragraphCount}</p>
        </div>
        <div className="bg-secondary rounded-lg px-3 py-2">
          <span className="text-muted-foreground">Liens</span>
          <p className="font-semibold text-foreground">{report.hasLinks ? "Oui" : "Non"}</p>
        </div>
      </div>

      {report.issues.length > 0 && (
        <div className="space-y-2">
          {report.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-secondary-foreground">
              <IssueIcon type={issue.type} />
              <span>{issue.label}</span>
            </div>
          ))}
        </div>
      )}

      {report.score >= 75 && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
          <CheckCircle2 size={14} />
          Article de bonne qualite, pret pour publication
        </div>
      )}
    </div>
  )
}
