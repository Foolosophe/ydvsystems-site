import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { getTranslations, getLocale } from "next-intl/server"
import { prisma } from "@/lib/db"
import { calculateReadTime } from "@/lib/blog/readTime"
import { ViewCounter } from "./view-counter"
import { ABTitle } from "./ab-title"
import { ShareButtons } from "./share-buttons"
import { RelatedArticles } from "@/components/blog/RelatedArticles"
import ReadingProgressBar from "@/components/blog/ReadingProgressBar"
import { TableOfContents, addHeadingIds } from "@/components/blog/TableOfContents"
import CodeHighlight from "@/components/blog/CodeHighlight"
import "./prism-theme.css"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true, publishedAt: true, metaDescription: true, keywords: true, coverImage: true },
  })

  if (!article) {
    const t = await getTranslations("blog.article")
    return { title: t("notFound") }
  }

  const description = article.metaDescription || article.excerpt

  return {
    title: `${article.title} — Blog YdvSystems`,
    description,
    keywords: article.keywords || undefined,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      url: `https://ydvsystems.com/${locale}/blog/${slug}`,
      siteName: "YdvSystems",
      ...(article.coverImage ? { images: [{ url: article.coverImage }] } : {}),
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
  })

  if (!article) notFound()

  const t = await getTranslations("blog.article")
  const locale = await getLocale()

  const relatedArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: slug },
      category: article.category,
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { title: true, slug: true, excerpt: true, category: true, coverImage: true },
  })

  const readTime = calculateReadTime(article.content)

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt?.toISOString(),
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
      { "@type": "ListItem", position: 2, name: t("breadcrumbBlog"), item: `https://ydvsystems.com/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://ydvsystems.com/${locale}/blog/${slug}` },
    ],
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]) }}
      />

      <CodeHighlight />
      <ViewCounter slug={slug} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t("backToBlog")}
        </Link>

        {article.coverImage && (
          <div className="mb-8 -mx-4 sm:mx-0">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 sm:h-80 object-cover rounded-none sm:rounded-xl"
            />
          </div>
        )}

        <header className="mb-10">
          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-4">
            {article.category}
          </Badge>
          <ABTitle articleId={article.id} fallbackTitle={article.title} />
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} min
            </span>
          </div>
        </header>

        <TableOfContents content={article.content} title={t("toc")} />

        <div
          className="prose-custom space-y-5 overflow-hidden [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-secondary-foreground [&_p]:leading-relaxed [&_p]:wrap-break-word [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-secondary-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-secondary-foreground [&_li]:leading-relaxed [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_hr]:border-border [&_hr]:my-8 [&_pre]:bg-secondary [&_pre]:border [&_pre]:border-border [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:text-sm [&_code]:text-foreground [&_code]:font-mono [&_img]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{ __html: addHeadingIds(article.content).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ') }}
        />

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              YD
            </div>
            <div>
              <p className="font-semibold text-foreground">Yohann Dandeville</p>
              <p className="text-sm text-muted-foreground">
                {t("authorRole")}
              </p>
            </div>
          </div>
          <ShareButtons title={article.title} slug={slug} />
        </div>

        <RelatedArticles
          articles={relatedArticles}
          title={t("relatedArticles")}
          readArticleLabel={t("readMore")}
        />

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
