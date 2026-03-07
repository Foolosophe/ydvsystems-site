import type { Metadata } from "next"
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
            locale={locale}
            translations={{
              searchPlaceholder: t("filters.searchPlaceholder"),
              allCategories: t("filters.allCategories"),
              noResults: t("filters.noResults"),
              readArticle: t("readArticle"),
              loadMore: t("filters.loadMore"),
            }}
          />

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
