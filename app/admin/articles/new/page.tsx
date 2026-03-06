"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ModeSelector, { type ArticleMode } from "@/components/admin/ModeSelector"
import ArticleEditor from "@/components/admin/ArticleEditor"
import AiAssistPanel from "@/components/admin/AiAssistPanel"
import AiGenerateForm from "@/components/admin/AiGenerateForm"
import DraftAutoSave from "@/components/admin/DraftAutoSave"
import PublishButton from "@/components/admin/PublishButton"
import { Save, Loader2, CheckCircle2 } from "lucide-react"
import { ARTICLE_CATEGORIES } from "@/lib/schemas/blog"

export default function NewArticlePage() {
  const router = useRouter()
  const [mode, setMode] = useState<ArticleMode>("libre")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [aiGenerated, setAiGenerated] = useState(false)

  async function handleSave() {
    setSaving(true)
    setError("")

    try {
      if (savedId) {
        const res = await fetch(`/api/admin/articles/${savedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, excerpt, category }),
        })
        if (!res.ok) {
          const json = await res.json()
          setError(json.error || "Erreur de sauvegarde")
        }
      } else {
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            excerpt,
            category,
            aiAssisted: mode !== "libre",
          }),
        })
        const json = await res.json()
        if (res.ok) {
          setSavedId(json.data.id)
        } else {
          setError(json.error || "Erreur de sauvegarde")
        }
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setSaving(false)
    }
  }

  function handleGenerated(data: { title: string; content: string; excerpt: string; category: string }) {
    setTitle(data.title)
    setContent(data.content)
    setExcerpt(data.excerpt)
    setCategory(data.category)
    setAiGenerated(true)
  }

  function handleInsertAi(text: string) {
    setContent((prev) => prev + text)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouvel article</h1>
          <p className="text-sm text-muted-foreground mt-1">Choisissez votre mode de redaction</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !title || !content || !excerpt || !category}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              title && content && excerpt && category
                ? "bg-primary text-white hover:bg-(--accent-hover) shadow-sm btn-glow"
                : "border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50"
            }`}
          >
            <span key={saving ? "loading" : "idle"}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </span>
            Sauvegarder
          </button>
          {savedId && <PublishButton articleId={savedId} status="DRAFT" />}
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

      <ModeSelector value={mode} onChange={setMode} />

      {mode === "genere" && !content ? (
        <AiGenerateForm onGenerated={handleGenerated} />
      ) : null}

      {(mode !== "genere" || content) && (
        <div className={`grid gap-6 ${mode === "assiste" ? "grid-cols-[1fr_320px]" : ""}`}>
          <div className="space-y-4">
            {aiGenerated && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Article genere avec succes. Relisez, modifiez si besoin, puis sauvegardez.</span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || !title || !content || !excerpt || !category}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 shadow-sm btn-glow"
                >
                  <span key={saving ? "loading" : "idle"}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  </span>
                  Sauvegarder
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Titre de l'article"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Categorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Choisir une categorie</option>
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Extrait</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Description courte (max 300 chars)"
                    maxLength={300}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6">
              <ArticleEditor
                content={content}
                onChange={setContent}
                onSelectionChange={setSelectedText}
              />
            </div>
          </div>

          {mode === "assiste" && (
            <AiAssistPanel selectedText={selectedText} content={content} onInsert={handleInsertAi} />
          )}
        </div>
      )}

      <DraftAutoSave
        articleId={savedId}
        title={title}
        content={content}
        category={category}
      />
    </div>
  )
}
