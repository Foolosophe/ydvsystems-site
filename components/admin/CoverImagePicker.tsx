"use client"

import { useState } from "react"
import { ImageIcon, Loader2, Search, X } from "lucide-react"

interface UnsplashPhoto {
  id: string
  url: string
  thumbUrl: string
  alt: string
  author: string
  authorUrl: string
}

interface CoverImagePickerProps {
  title: string
  excerpt: string
  coverImage: string
  onSelect: (url: string) => void
}

export default function CoverImagePicker({ title, excerpt, coverImage, onSelect }: CoverImagePickerProps) {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [customQuery, setCustomQuery] = useState("")
  const [error, setError] = useState("")

  async function handleSearch(query?: string) {
    if (!title || !excerpt) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, query }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        setPhotos(json.data.photos)
        setKeywords(json.data.keywords)
      } else {
        setError(json.error || "Erreur")
      }
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-(--shadow-card) p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ImageIcon size={18} />
        <h3 className="font-semibold text-sm">Image de couverture</h3>
      </div>

      {coverImage && (
        <div className="relative">
          <img src={coverImage} alt="Couverture" className="w-full h-32 object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => onSelect("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => handleSearch()}
        disabled={loading || !title || !excerpt}
        className="w-full py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        Rechercher des images
      </button>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleSearch(kw)}
              className="px-2 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Recherche manuelle..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter" && customQuery.trim()) handleSearch(customQuery.trim())
          }}
        />
        <button
          type="button"
          onClick={() => customQuery.trim() && handleSearch(customQuery.trim())}
          disabled={loading || !customQuery.trim()}
          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
        >
          <Search size={12} />
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onSelect(photo.url)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                coverImage === photo.url ? "border-primary" : "border-transparent hover:border-primary/50"
              }`}
            >
              <img src={photo.thumbUrl} alt={photo.alt} className="w-full h-20 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <span className="absolute bottom-0.5 left-0.5 text-[9px] text-white/70 truncate max-w-full px-1">
                {photo.author}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
