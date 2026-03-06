"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ArticleEditor from "@/components/admin/ArticleEditor"
import AiAssistPanel from "@/components/admin/AiAssistPanel"
import DraftAutoSave from "@/components/admin/DraftAutoSave"
import PublishButton from "@/components/admin/PublishButton"
import ArticlePreview from "@/components/admin/ArticlePreview"
import QualityScorePanel from "@/components/admin/QualityScorePanel"
import SeoPanel from "@/components/admin/SeoPanel"
import CoverImagePicker from "@/components/admin/CoverImagePicker"
import ReviewChecklist from "@/components/admin/ReviewChecklist"
import SectionManager from "@/components/admin/SectionManager"
import TranslateButton from "@/components/admin/TranslateButton"
import ABTestPanel from "@/components/admin/ABTestPanel"
import { Save, Loader2, ArrowLeft, Share2, CheckCircle2, Eye, EyeOff } from "lucide-react"
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
  metaDescription: string | null
  keywords: string | null
  coverImage: string | null
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
  const [preview, setPreview] = useState(false)
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [slug, setSlug] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [checklistProg, setChecklistProg] = useState(0)

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
          setMetaDescription(a.metaDescription || "")
          setKeywords(a.keywords || "")
          setSlug(a.slug)
          setCoverImage(a.coverImage || "")
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
        body: JSON.stringify({ title, content, excerpt, category, metaDescription: metaDescription || null, keywords: keywords || null, coverImage: coverImage || null }),
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
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
              preview
                ? "border-primary text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            Apercu
          </button>
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
          <PublishButton articleId={article.id} status={article.status} checklistProgress={checklistProg} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

      {preview ? (
        <div className="bg-white rounded-xl border border-border shadow-(--shadow-card) p-8">
          <ArticlePreview title={title} content={content} category={category} excerpt={excerpt} />
        </div>
      ) : (
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

            <QualityScorePanel content={content} />
          </div>

          {showAssist && (
            <div className="space-y-4">
              <AiAssistPanel
                selectedText={selectedText}
                content={content}
                onInsert={(text) => setContent((prev) => prev + text)}
                onTitleChange={setTitle}
              />
              <SeoPanel
                title={title}
                content={content}
                excerpt={excerpt}
                slug={slug}
                metaDescription={metaDescription}
                keywords={keywords}
                onApply={(field, value) => {
                  if (field === "title") setTitle(value)
                  else if (field === "slug") setSlug(value)
                  else if (field === "metaDescription") setMetaDescription(value)
                  else if (field === "keywords") setKeywords(value)
                }}
              />
              <CoverImagePicker
                title={title}
                excerpt={excerpt}
                coverImage={coverImage}
                onSelect={setCoverImage}
              />
              <SectionManager
                articleId={article.id}
                content={content}
                onContentChange={setContent}
              />
              <ReviewChecklist
                title={title}
                content={content}
                excerpt={excerpt}
                metaDescription={metaDescription}
                keywords={keywords}
                coverImage={coverImage}
                onProgressChange={setChecklistProg}
              />
              <TranslateButton articleId={article.id} />
              <ABTestPanel articleId={article.id} currentTitle={title} />
            </div>
          )}
        </div>
      )}

      <DraftAutoSave
        articleId={article.id}
        title={title}
        content={content}
        category={category}
      />
    </div>
  )
}
