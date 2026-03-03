import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { getTranslations, getLocale } from "next-intl/server"
import { BLOG_SLUGS, BLOG_DATES } from "../data"

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!BLOG_SLUGS.includes(slug as typeof BLOG_SLUGS[number])) {
    const t = await getTranslations("blog.article")
    return { title: t("notFound") }
  }

  const ta = await getTranslations("data.blogArticles")
  const title = ta(`${slug}.title`)
  const excerpt = ta(`${slug}.excerpt`)

  return {
    title: `${title} — Blog YdvSystems`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: BLOG_DATES[slug],
      url: `https://ydvsystems.com/blog/${slug}`,
      siteName: "YdvSystems",
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!BLOG_SLUGS.includes(slug as typeof BLOG_SLUGS[number])) notFound()

  const t = await getTranslations("blog.article")
  const ta = await getTranslations("data.blogArticles")
  const locale = await getLocale()

  const title = ta(`${slug}.title`)
  const excerpt = ta(`${slug}.excerpt`)
  const category = ta(`${slug}.category`)
  const readTime = ta(`${slug}.readTime`)
  const content = ta.raw(`${slug}.content`) as string[]
  const date = BLOG_DATES[slug]

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: date,
    author: {
      "@type": "Person",
      name: "Yohann Dandeville",
    },
    publisher: {
      "@type": "Organization",
      name: "YdvSystems",
      url: "https://ydvsystems.com",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: "https://ydvsystems.com" },
      { "@type": "ListItem", position: 2, name: t("breadcrumbBlog"), item: "https://ydvsystems.com/blog" },
      { "@type": "ListItem", position: 3, name: title, item: `https://ydvsystems.com/blog/${slug}` },
    ],
  }

  const formattedDate = new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t("backToBlog")}
        </Link>

        <header className="mb-10">
          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-4">
            {category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} {t("readTime")}
            </span>
          </div>
        </header>

        <div className="prose-custom space-y-5">
          {content.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">
                  {block.replace("## ", "")}
                </h2>
              )
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
                  {block.replace("### ", "")}
                </h3>
              )
            }
            if (block.startsWith("```")) {
              const code = block.replace(/```\w*\n?/, "").replace(/```$/, "")
              return (
                <pre key={i} className="bg-secondary border border-border rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm text-foreground font-mono">{code}</code>
                </pre>
              )
            }
            return (
              <p key={i} className="text-secondary-foreground leading-relaxed">
                {block}
              </p>
            )
          })}
        </div>

        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              YD
            </div>
            <div>
              <p className="font-semibold text-foreground">Yohann Dandeville</p>
              <p className="text-sm text-muted-foreground">
                {t("authorRole")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            {t("allArticles")}
          </Link>
          <Link
            href="/contact"
            className="text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors"
          >
            {t("contactCta")} &rarr;
          </Link>
        </div>
      </article>
    </main>
  )
}
