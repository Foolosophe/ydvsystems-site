"use client"

interface StatsWidgetProps {
  label: string
  value: number | string
}

export default function StatsWidget({ label, value }: StatsWidgetProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-white/50">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  )
}
