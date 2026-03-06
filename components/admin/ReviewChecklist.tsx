"use client"

import { useMemo, useState, useEffect } from "react"
import { generateChecklist, checklistProgress, type ChecklistItem } from "@/lib/ai/checklist"
import { CheckCircle2, Circle, Lock } from "lucide-react"

interface ReviewChecklistProps {
  title: string
  content: string
  excerpt: string
  metaDescription: string | null
  keywords: string | null
  coverImage: string | null
  onProgressChange?: (progress: number) => void
}

export default function ReviewChecklist({
  title,
  content,
  excerpt,
  metaDescription,
  keywords,
  coverImage,
  onProgressChange,
}: ReviewChecklistProps) {
  const autoItems = useMemo(
    () => generateChecklist(title, content, excerpt, metaDescription, keywords, coverImage),
    [title, content, excerpt, metaDescription, keywords, coverImage]
  )

  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({})

  const items: ChecklistItem[] = autoItems.map((item) => ({
    ...item,
    checked: item.auto ? item.checked : manualChecks[item.id] || false,
  }))

  const progress = checklistProgress(items)

  useEffect(() => {
    onProgressChange?.(progress)
  }, [progress, onProgressChange])

  function toggleManual(id: string) {
    setManualChecks((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Checklist de relecture</h3>
        <span className={`text-sm font-bold ${progress === 100 ? "text-green-600" : progress >= 70 ? "text-yellow-600" : "text-red-500"}`}>
          {progress}%
        </span>
      </div>

      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            progress === 100 ? "bg-green-500" : progress >= 70 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            {item.auto ? (
              <div className="mt-0.5">
                {item.checked ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-muted-foreground/40" />
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => toggleManual(item.id)}
                className="mt-0.5"
              >
                {item.checked ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
            )}
            <span className={`text-xs ${item.checked ? "text-foreground" : "text-muted-foreground"}`}>
              {item.label}
              {item.auto && (
                <Lock size={10} className="inline ml-1 text-muted-foreground/30" />
              )}
            </span>
          </div>
        ))}
      </div>

      {progress < 100 && (
        <p className="text-xs text-muted-foreground">
          Completez tous les points pour pouvoir publier.
        </p>
      )}
    </div>
  )
}
