"use client"

import { useState } from "react"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"

interface Props {
  translations: {
    title: string
    description: string
    placeholder: string
    button: string
    success: string
    alreadySubscribed: string
    error: string
  }
  confirmMessage?: string | null
}

export default function NewsletterForm({ translations: t, confirmMessage }: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">(
    confirmMessage === "confirmed" ? "success" : "idle"
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus("error")
      } else if (json.message === "already_subscribed") {
        setStatus("already")
      } else {
        setStatus("success")
        setEmail("")
      }
    } catch {
      setStatus("error")
    }
  }

  if (confirmMessage === "confirmed") {
    return (
      <div className="text-center mt-12 p-8 bg-secondary border border-border rounded-xl">
        <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{t.title}</h3>
        <p className="text-sm text-green-600 font-medium">{t.success}</p>
      </div>
    )
  }

  return (
    <div className="text-center mt-12 p-8 bg-secondary border border-border rounded-xl">
      <h3 className="text-lg font-semibold text-foreground mb-2">{t.title}</h3>
      <p className="text-sm text-secondary-foreground mb-4">{t.description}</p>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm">
          <CheckCircle2 size={18} />
          {t.success}
        </div>
      ) : status === "already" ? (
        <p className="text-sm text-primary font-medium">{t.alreadySubscribed}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-(--accent-hover) transition-colors disabled:opacity-50 shadow-sm"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {t.button}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive mt-2">{t.error}</p>
      )}
    </div>
  )
}
