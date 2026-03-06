"use client"

import { useState, useRef, useEffect } from "react"
import { HelpCircle } from "lucide-react"

interface FieldTooltipProps {
  text: string
}

export default function FieldTooltip({ text }: FieldTooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-primary transition-colors p-0.5"
        aria-label="Aide"
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <div className="absolute z-50 left-6 top-0 w-72 p-3 rounded-lg bg-foreground text-white text-xs leading-relaxed shadow-lg">
          <div className="absolute -left-1.5 top-2 w-3 h-3 bg-foreground rotate-45" />
          <p>{text}</p>
        </div>
      )}
    </div>
  )
}
