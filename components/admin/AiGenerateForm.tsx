"use client"

import { useState } from "react"
import { Wand2, Loader2, ArrowRight, ArrowLeft, Check, GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import LengthSelector, { type ArticleLength } from "./LengthSelector"
import FieldTooltip from "./FieldTooltip"
import { ARTICLE_CATEGORIES } from "@/lib/schemas/blog"

interface AiGenerateFormProps {
  onGenerated: (data: { title: string; content: string; excerpt: string; category: string }) => void
}

export interface ArticleBrief {
  subject: string
  angle: string
  audience: string
  keyPoints: string
  sources: string
  tone: string
  length: ArticleLength
  category: string
}

export interface OutlineSection {
  title: string
  description: string
}

const AUDIENCES = [
  { value: "pme", label: "Dirigeants PME / TPE" },
  { value: "dsi", label: "DSI / Responsables IT" },
  { value: "insertion", label: "Professionnels de l'insertion" },
  { value: "rh", label: "RH / Recrutement" },
  { value: "devs", label: "Developpeurs / Tech" },
  { value: "general", label: "Grand public" },
]

const TONES = [
  { value: "professionnel", label: "Professionnel", desc: "Formel, expertise, credibilite" },
  { value: "conversationnel", label: "Conversationnel", desc: "Accessible, engage, direct" },
  { value: "technique", label: "Technique", desc: "Precis, code, tutoriel" },
  { value: "storytelling", label: "Storytelling", desc: "Recit, cas concret, immersif" },
]

type Step = "brief" | "outline" | "generating"

export default function AiGenerateForm({ onGenerated }: AiGenerateFormProps) {
  const [step, setStep] = useState<Step>("brief")

  // Brief state
  const [subject, setSubject] = useState("")
  const [angle, setAngle] = useState("")
  const [audience, setAudience] = useState("pme")
  const [keyPoints, setKeyPoints] = useState("")
  const [sources, setSources] = useState("")
  const [tone, setTone] = useState("professionnel")
  const [length, setLength] = useState<ArticleLength>("medium")
  const [category, setCategory] = useState("")

  // Outline state
  const [outline, setOutline] = useState<OutlineSection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function getBrief(): ArticleBrief {
    return { subject, angle, audience, keyPoints, sources, tone, length, category }
  }

  // Step 1 → Step 2 : generer le plan
  async function handleGenerateOutline() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getBrief(), action: "outline" }),
      })

      const json = await res.json()
      if (res.ok && json.data) {
        setOutline(json.data)
        setStep("outline")
      } else {
        setError(json.error || "Erreur de generation du plan")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  // Step 2 → Step 3 : generer l'article
  async function handleGenerateArticle() {
    setLoading(true)
    setError("")
    setStep("generating")

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getBrief(), action: "article", outline }),
      })

      const json = await res.json()
      if (res.ok && json.data) {
        onGenerated({ ...json.data, category })
      } else {
        setError(json.error || "Erreur de generation de l'article")
        setStep("outline")
      }
    } catch {
      setError("Erreur de connexion")
      setStep("outline")
    } finally {
      setLoading(false)
    }
  }

  // Outline manipulation
  function updateSection(index: number, field: keyof OutlineSection, value: string) {
    setOutline((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  function removeSection(index: number) {
    setOutline((prev) => prev.filter((_, i) => i !== index))
  }

  function addSection() {
    setOutline((prev) => [...prev, { title: "", description: "" }])
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= outline.length) return
    setOutline((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
  const textareaClasses = `${inputClasses} resize-none`

  // ——— STEP 1: BRIEF ———
  if (step === "brief") {
    return (
      <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-6 space-y-5">
        <div className="flex items-center gap-2 text-primary mb-1">
          <Wand2 size={18} />
          <h3 className="font-semibold">Brief de l&apos;article</h3>
          <span className="ml-auto text-xs text-muted-foreground font-normal">Etape 1/3</span>
        </div>

        <p className="text-xs text-muted-foreground -mt-3">
          Plus le brief est detaille, plus l&apos;article sera pertinent et personnalise. Les champs marques * sont obligatoires.
        </p>

        {/* Sujet */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            Sujet *
            <FieldTooltip text="Le theme principal de votre article. Soyez precis : 'L'impact de l'IA sur le suivi des beneficiaires en SIAE' est mieux que 'L'IA dans l'insertion'." />
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClasses}
            placeholder="Ex: Comment l'IA transforme le suivi des beneficiaires en structure d'insertion"
            required
          />
        </div>

        {/* Angle */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            Angle / These
            <FieldTooltip text="Quel point de vue defendez-vous ? L'angle donne une direction a l'article et evite le contenu generique. Ex: 'L'IA ne remplace pas le CIP, elle le rend plus efficace'." />
          </label>
          <input
            type="text"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className={inputClasses}
            placeholder="Ex: L'IA est un levier, pas un remplacement — elle augmente l'humain"
          />
        </div>

        {/* Audience + Ton */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              Public cible *
              <FieldTooltip text="A qui s'adresse cet article ? Le vocabulaire, le niveau de detail et les exemples seront adaptes en consequence." />
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={inputClasses}
            >
              {AUDIENCES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              Ton
              <FieldTooltip text="Le style d'ecriture. Professionnel pour la credibilite, Conversationnel pour l'engagement, Technique pour les tutoriels, Storytelling pour raconter une experience." />
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={inputClasses}
            >
              {TONES.map(({ value, label, desc }) => (
                <option key={value} value={value}>{label} — {desc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Points cles */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            Points cles a aborder
            <FieldTooltip text="Listez les idees, arguments ou sections que vous voulez absolument voir dans l'article. Une idee par ligne. L'IA structurera le plan autour de ces points." />
          </label>
          <textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            className={textareaClasses}
            rows={4}
            placeholder={"Ex:\n- Les gains de temps concrets (chiffres)\n- L'exemple de notre outil CIP Platform\n- Les limites ethiques a considerer\n- Temoignage d'un CIP utilisateur"}
          />
        </div>

        {/* Sources */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            Sources et references
            <FieldTooltip text="Collez des URLs, des citations, des statistiques ou des extraits de documents. L'IA les integrera dans l'article avec des citations propres. Chaque source sur une ligne." />
          </label>
          <textarea
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            className={textareaClasses}
            rows={3}
            placeholder={"Ex:\n- Etude Pole Emploi 2025 : 34% des SIAE utilisent des outils numeriques\n- https://travail-emploi.gouv.fr/rapport-ia-insertion\n- Citation DG : 'Nous avons reduit le temps de reporting de 40%'"}
          />
        </div>

        {/* Categorie + Longueur */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              Categorie *
              <FieldTooltip text="La rubrique du blog ou sera classe l'article." />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            >
              <option value="">Choisir une categorie</option>
              {ARTICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              Longueur
              <FieldTooltip text="Court : billet d'actualite ou point de vue rapide. Moyen : article de fond standard. Long : guide complet ou analyse approfondie." />
            </label>
            <LengthSelector value={length} onChange={setLength} />
          </div>
        </div>

        {error && <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="button"
          onClick={handleGenerateOutline}
          disabled={loading || !subject || !category}
          className="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm btn-glow"
        >
          <span key={loading ? "loading" : "idle"}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          </span>
          <span>{loading ? "Generation du plan..." : "Generer le plan de l'article"}</span>
        </button>
      </div>
    )
  }

  // ——— STEP 2: OUTLINE ———
  if (step === "outline") {
    return (
      <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-6 space-y-5">
        <div className="flex items-center gap-2 text-primary mb-1">
          <Wand2 size={18} />
          <h3 className="font-semibold">Plan de l&apos;article</h3>
          <span className="ml-auto text-xs text-muted-foreground font-normal">Etape 2/3</span>
        </div>

        <p className="text-xs text-muted-foreground -mt-3">
          Reorganisez, modifiez ou supprimez les sections. L&apos;article sera redige en suivant ce plan exactement.
        </p>

        <div className="space-y-3">
          {outline.map((section, i) => (
            <div
              key={i}
              className="flex gap-2 items-start p-3 rounded-lg border border-border bg-secondary/50 group"
            >
              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  type="button"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <GripVertical size={14} className="text-muted-foreground/50" />
                <button
                  type="button"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === outline.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    H2
                  </span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(i, "title", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Titre de la section"
                  />
                </div>
                <textarea
                  value={section.description}
                  onChange={(e) => updateSection(i, "description", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  rows={2}
                  placeholder="Ce que cette section doit couvrir..."
                />
              </div>

              <button
                type="button"
                onClick={() => removeSection(i)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/30 rounded-lg transition-colors w-full justify-center"
        >
          <Plus size={14} />
          <span>Ajouter une section</span>
        </button>

        {error && <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep("brief")}
            className="flex-1 py-2.5 rounded-xl border border-border text-secondary-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Modifier le brief</span>
          </button>
          <button
            type="button"
            onClick={handleGenerateArticle}
            disabled={loading || outline.length === 0 || outline.some((s) => !s.title)}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm btn-glow"
          >
            <span key={loading ? "loading" : "idle"}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </span>
            <span>{loading ? "Redaction en cours..." : "Rediger l'article"}</span>
          </button>
        </div>
      </div>
    )
  }

  // ——— STEP 3: GENERATING ———
  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-8 flex flex-col items-center gap-4">
      <Loader2 size={32} className="animate-spin text-primary" />
      <div className="text-center">
        <h3 className="font-semibold text-foreground">Redaction en cours</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gemini redige votre article en suivant le plan valide. Cela peut prendre 15-30 secondes.
        </p>
      </div>
      {error && (
        <div className="w-full">
          <p className="text-sm text-destructive bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          <button
            type="button"
            onClick={() => setStep("outline")}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Revenir au plan
          </button>
        </div>
      )}
    </div>
  )
}
