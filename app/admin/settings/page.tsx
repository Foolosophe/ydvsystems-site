"use client"

import { useEffect, useState } from "react"
import { Save, Loader2, CheckCircle2 } from "lucide-react"

const TONE_FIELDS = [
  {
    key: "tone_brandVoice",
    label: "Voix de marque",
    placeholder: "Ex: Ton expert mais accessible, direct sans jargon inutile. On tutoie le lecteur. On privilegie les exemples concrets.",
    type: "textarea" as const,
  },
  {
    key: "tone_keywords",
    label: "Mots-cles de marque",
    placeholder: "Ex: YdvSystems, insertion professionnelle, IA responsable, accompagnement, transformation digitale",
    type: "input" as const,
  },
  {
    key: "tone_examples",
    label: "Exemples de style (phrases types)",
    placeholder: "Ex:\n- \"L'IA ne remplace pas l'humain, elle lui donne les moyens de mieux faire.\"\n- \"Concretement, ca veut dire quoi pour votre PME ?\"",
    type: "textarea" as const,
  },
  {
    key: "tone_avoidWords",
    label: "Mots / expressions a eviter",
    placeholder: "Ex: revolutionner, disruptif, game-changer, synergies, leverager, a l'heure ou",
    type: "input" as const,
  },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setValues(json.data)
      })
      .finally(() => setLoaded(true))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const toneValues = Object.fromEntries(
        TONE_FIELDS.map((f) => [f.key, values[f.key] || ""])
      )
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toneValues),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <p className="text-muted-foreground">Chargement...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reglages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Guide de style applique a toutes les generations IA
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-(--accent-hover) transition-colors disabled:opacity-50 shadow-sm btn-glow"
        >
          <span key={saving ? "loading" : saved ? "saved" : "idle"}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} className="text-green-300" /> : <Save size={16} />}
          </span>
          {saved ? "Sauvegarde !" : "Sauvegarder"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Tone of Voice</h2>
        <p className="text-xs text-muted-foreground -mt-3">
          Ces parametres sont injectes dans chaque prompt IA (generation d&apos;article, assistance texte, posts sociaux).
        </p>

        {TONE_FIELDS.map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
            {type === "textarea" ? (
              <textarea
                value={values[key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-y"
              />
            ) : (
              <input
                type="text"
                value={values[key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
