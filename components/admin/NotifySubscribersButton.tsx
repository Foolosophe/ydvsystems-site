"use client"

import { useState } from "react"
import { Bell, Loader2, CheckCircle2 } from "lucide-react"

interface Props {
  articleId: number
}

export default function NotifySubscribersButton({ articleId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [sentCount, setSentCount] = useState(0)
  const [confirming, setConfirming] = useState(false)

  async function handleSend() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    setConfirming(false)
    setStatus("loading")

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      })
      const json = await res.json()

      if (res.ok) {
        setStatus("sent")
        setSentCount(json.sent)
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle2 size={16} />
        {sentCount} abonne{sentCount > 1 ? "s" : ""} notifie{sentCount > 1 ? "s" : ""}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSend}
        disabled={status === "loading"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          confirming
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : "border border-border text-secondary-foreground hover:text-primary hover:bg-secondary"
        }`}
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Bell size={16} />
        )}
        {confirming ? "Confirmer l'envoi" : "Notifier les abonnes"}
      </button>
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Annuler
        </button>
      )}
      {status === "error" && (
        <span className="text-sm text-destructive">Erreur d'envoi</span>
      )}
    </div>
  )
}
