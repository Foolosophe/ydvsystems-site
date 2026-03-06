"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Circle, CheckCircle2, Clock } from "lucide-react"

interface ArticleSummary {
  id: number
  title: string
  status: string
  publishedAt: string | null
  scheduledAt: string | null
  createdAt: string
}

export default function CalendarPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setArticles(json.data)
      })
  }, [])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  // Lundi = 0 en francais
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const articlesByDay = useMemo(() => {
    const map: Record<number, ArticleSummary[]> = {}
    for (const a of articles) {
      const dateStr = a.scheduledAt || a.publishedAt || a.createdAt
      if (!dateStr) continue
      const d = new Date(dateStr)
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(a)
      }
    }
    return map
  }, [articles, month, year])

  const monthName = new Date(year, month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendrier editorial</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue mensuelle de vos publications</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-foreground capitalize">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
            <div key={d} className="bg-secondary px-2 py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white min-h-[80px]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayArticles = articlesByDay[day] || []
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`bg-white min-h-[80px] p-1.5 ${isToday ? "ring-2 ring-primary ring-inset" : ""}`}
              >
                <span className={`text-xs ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayArticles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/admin/articles/${a.id}`}
                      className={`block px-1.5 py-0.5 rounded text-[10px] truncate transition-colors ${
                        a.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : a.status === "REVIEW"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-secondary text-muted-foreground hover:bg-border"
                      }`}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {a.status === "PUBLISHED" ? <CheckCircle2 size={8} /> : a.scheduledAt ? <Clock size={8} /> : <Circle size={8} />}
                        {a.title.slice(0, 25)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-200" /> Publie</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" /> En relecture</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary border border-border" /> Brouillon</span>
      </div>
    </div>
  )
}
