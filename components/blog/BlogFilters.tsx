"use client"

import { useState, useMemo } from "react"
import { Search, X, ArrowRight, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Article {
  title: string
  slug: string
  excerpt: string
  category: string
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
    loadMore: string
  }
  perPage: number
  locale: string
}

export default function BlogFilters({ articles, categories, translations: t, perPage, locale }: Props) {
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

      {/* Articles grid or empty state */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t.noResults}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map((article) => (
              <Link key={article.slug} href={`/${locale}/blog/${article.slug}`} className="block group h-full">
                <Card className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
                  <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                  {article.coverImage && (
                    <div className="h-44 overflow-hidden">
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs">
                        {article.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {article.formattedDate}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {article.readTime} min
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-secondary-foreground leading-relaxed mb-3 flex-1">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold group-hover:gap-2.5 transition-all">
                      {t.readArticle}
                      <ArrowRight size={14} />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={showMore}
                className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-secondary-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {t.loadMore}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
