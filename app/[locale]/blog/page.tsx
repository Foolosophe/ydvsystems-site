import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { getLocale } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { prisma } from "@/lib/db"
import { calculateReadTime } from "@/lib/blog/readTime"
import NewsletterForm from "@/components/NewsletterForm"
import BlogFilters from "@/components/blog/BlogFilters"

export const dynamic = "force-dynamic"

const ARTICLES_PER_PAGE = 6

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ newsletter?: string }> }) {
  const t = await getTranslations("blog")
  const locale = await getLocale()
  const { newsletter: newsletterStatus } = await searchParams

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      content: true,
      publishedAt: true,
      coverImage: true,
    },
  })

  const serialized = articles.map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    content: article.content,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    coverImage: article.coverImage,
    readTime: calculateReadTime(article.content),
    formattedDate: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
  }))

  const categories = [...new Set(articles.map((a) => a.category))].sort()

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("header.title"),
            description: t("header.description"),
            url: `https://ydvsystems.com/${locale}/blog`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: articles.map((article, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://ydvsystems.com/${locale}/blog/${article.slug}`,
                name: article.title,
              })),
            },
          }),
        }}
      />

      {/* Header */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="section-tag">{t("header.tag")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {t("header.title")}
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
              {t("header.description")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Articles */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogFilters
            articles={serialized}
            categories={categories}
            perPage={ARTICLES_PER_PAGE}
            translations={{
              searchPlaceholder: t("filters.searchPlaceholder"),
              allCategories: t("filters.allCategories"),
              noResults: t("filters.noResults"),
              readArticle: t("readArticle"),
            }}
          >
            {(visibleArticles, showMore, hasMore) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleArticles.map((article, i) => (
                    <AnimateOnScroll key={article.slug} delay={i * 80}>
                      <Link href={`/blog/${article.slug}`} className="block group h-full">
                        <Card className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
                          <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                          {article.coverImage && (
                            <div className="h-44 overflow-hidden">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
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
                              {t("readArticle")}
                              <ArrowRight size={14} />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </AnimateOnScroll>
                  ))}
                </div>

                {/* Pagination - Load more */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={showMore}
                      className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-secondary-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {t("filters.loadMore")}
                    </button>
                  </div>
                )}
              </>
            )}
          </BlogFilters>

          {/* Newsletter */}
          <AnimateOnScroll>
            <NewsletterForm
              translations={{
                title: t("newsletter.title"),
                description: t("newsletter.description"),
                placeholder: t("newsletter.placeholder"),
                button: t("newsletter.button"),
                success: t("newsletter.success"),
                alreadySubscribed: t("newsletter.alreadySubscribed"),
                error: t("newsletter.error"),
              }}
              confirmMessage={newsletterStatus}
            />
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
