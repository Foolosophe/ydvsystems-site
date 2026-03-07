"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Article {
  title: string
  slug: string
  excerpt: string
  category: string
  content: string
  publishedAt: string | null
  coverImage: string | null
  readTime: number
  formattedDate: string
}

interface Props {
  articles: Article[]
  categories: string[]
  translations: {
    searchPlaceholder: string
    allCategories: string
    noResults: string
    readArticle: string
  }
  perPage: number
  children: (filteredArticles: Article[], showMore: () => void, hasMore: boolean) => React.ReactNode
}

export default function BlogFilters({ articles, categories, translations: t, perPage, children }: Props) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(perPage)

  const filtered = useMemo(() => {
    let result = articles

    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    }

    return result
  }, [articles, search, activeCategory])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function showMore() {
    setVisibleCount((prev) => prev + perPage)
  }

  function handleCategoryClick(cat: string | null) {
    setActiveCategory(cat)
    setVisibleCount(perPage)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setVisibleCount(perPage)
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative max-w-md mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-white border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {search && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => handleCategoryClick(null)}>
          <Badge
            variant="secondary"
            className={`cursor-pointer text-xs px-3 py-1 transition-all ${
              !activeCategory
                ? "bg-primary text-white border-primary"
                : "bg-secondary text-muted-foreground border-0 hover:bg-primary/10"
            }`}
          >
            {t.allCategories}
          </Badge>
        </button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(activeCategory === cat ? null : cat)}>
            <Badge
              variant="secondary"
              className={`cursor-pointer text-xs px-3 py-1 transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary text-muted-foreground border-0 hover:bg-primary/10"
              }`}
            >
              {cat}
            </Badge>
          </button>
        ))}
      </div>

      {/* Results count when filtering */}
      {(search || activeCategory) && (
        <p className="text-center text-sm text-muted-foreground">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Articles or empty state */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t.noResults}</p>
      ) : (
        children(visible, showMore, hasMore)
      )}
    </div>
  )
}
