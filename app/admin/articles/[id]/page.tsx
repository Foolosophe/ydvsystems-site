"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ArticleEditor from "@/components/admin/ArticleEditor"
import AiAssistPanel from "@/components/admin/AiAssistPanel"
import DraftAutoSave from "@/components/admin/DraftAutoSave"
import PublishButton from "@/components/admin/PublishButton"
import { Save, Loader2, ArrowLeft, Share2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ARTICLE_CATEGORIES } from "@/lib/schemas/blog"

interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  status: string
}

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [saving, setSaving] = useState(false)
  const [showAssist, setShowAssist] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          const a = json.data
          setArticle(a)
          setTitle(a.title)
          setContent(a.content)
          setExcerpt(a.excerpt)
          setCategory(a.category)
        }
      })
      .finally(() => setLoaded(true))
  }, [id])

  async function handleSave() {
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, category }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const json = await res.json()
        setError(json.error || "Erreur de sauvegarde")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <p className="text-muted-foreground">Chargement...</p>
  if (!article) return <p className="text-destructive">Article non trouve</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier l&apos;article</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{article.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssist(!showAssist)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
              showAssist
                ? "border-primary text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            Assistance IA
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title || !content || !excerpt || !category}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              title && content && excerpt && category
                ? "bg-primary text-white hover:bg-(--accent-hover) shadow-sm btn-glow"
                : "border border-border text-secondary-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50"
            }`}
          >
            <span key={saving ? "loading" : saved ? "saved" : "idle"}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} className="text-green-300" /> : <Save size={16} />}
            </span>
            {saved ? "Sauvegarde !" : "Sauvegarder"}
          </button>
          {article.status === "PUBLISHED" && (
            <Link
              href={`/admin/articles/${article.id}/share`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-secondary-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              <Share2 size={16} />
              <span>Partager</span>
            </Link>
          )}
          <PublishButton articleId={article.id} status={article.status} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

      <div className={`grid gap-6 ${showAssist ? "grid-cols-[1fr_320px]" : ""}`}>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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

        {showAssist && (
          <AiAssistPanel
            selectedText={selectedText}
            content={content}
            onInsert={(text) => setContent((prev) => prev + text)}
            onTitleChange={setTitle}
          />
        )}
      </div>

      <DraftAutoSave
        articleId={article.id}
        title={title}
        content={content}
        category={category}
      />
    </div>
  )
}
