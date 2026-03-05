"use client"

import { CountUp } from "@/components/CountUp"
import { STATS } from "@/lib/data"
import { useTranslations } from "next-intl"

const STAT_KEYS = ["projects", "tests", "sectors", "platforms"] as const

// Parse stat values: "10+" → { num: 10, suffix: "+" }, "4 253" → { num: 4253, suffix: "" }
function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d\s]+)(.*)$/)
  if (!match) return { num: 0, suffix: value }
  const num = parseInt(match[1].replace(/\s/g, ""), 10)
  const suffix = match[2].trim()
  return { num, suffix }
}

export function StatsGrid() {
  const ts = useTranslations("home.stats")

  return (
    <div className="grid grid-cols-2 gap-4">
      {STATS.map((stat, i) => {
        const { num, suffix } = parseStat(stat.value)
        return (
          <div key={STAT_KEYS[i]} className="bg-white border border-border rounded-xl p-4 shadow-(--shadow-card)">
            <div className="text-2xl font-bold text-primary">
              <CountUp end={num} suffix={suffix} />
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-0.5">{ts(STAT_KEYS[i])}</div>
          </div>
        )
      })}
    </div>
  )
}
