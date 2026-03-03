"use client"

import { useState } from "react"

export type BillingPeriod = "annual" | "monthly"

export function PricingToggle({
  onChange,
}: {
  onChange: (period: BillingPeriod) => void
}) {
  const [period, setPeriod] = useState<BillingPeriod>("annual")

  function toggle(p: BillingPeriod) {
    setPeriod(p)
    onChange(p)
  }

  return (
    <div className="inline-flex items-center gap-1 bg-secondary border border-border rounded-full p-1">
      <button
        onClick={() => toggle("annual")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          period === "annual"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-secondary-foreground"
        }`}
      >
        Annuel
      </button>
      <button
        onClick={() => toggle("monthly")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          period === "monthly"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-secondary-foreground"
        }`}
      >
        Mensuel
        <span className="ml-1 text-xs text-muted-foreground">+20%</span>
      </button>
    </div>
  )
}
