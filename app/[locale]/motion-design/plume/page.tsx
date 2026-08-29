import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { FilmPlayer } from "@/components/motion-design/FilmPlayer"
import { getPageAlternates, localeUrl } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("plumeFilm.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "motion-design/plume"),
  }
}

type Fact = { label: string; value: string }

export default async function PlumeFilmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("plumeFilm")
  const base = localeUrl("fr").replace(/\/$/, "")

  const facts = t.raw("facts") as Fact[]
  const madeWith = t.raw("madeWith.items") as string[]

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: t("hero.title"),
            description: t("meta.description"),
            thumbnailUrl: `${base}/motion-design/plume-poster.jpg`,
            contentUrl: `${base}/motion-design/plume-teaser.mp4`,
            embedUrl: localeUrl(locale, "/motion-design/plume"),
            uploadDate: "2026-06-22",
            duration: "PT48S",
            width: 1920,
            height: 1080,
            inLanguage: "fr",
            creator: {
              "@type": "Person",
              name: "Yohann Dandeville",
              url: localeUrl(locale),
            },
          }),
        }}
      />

      {/* Le film, immediatement — pas de scroll pour l'atteindre */}
      <section className="pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <p className="section-tag mb-2">{t("hero.tag")}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {t("hero.title")}
              </h1>
            </div>
            <p className="text-sm font-medium text-muted-foreground sm:text-right">
              {t("hero.meta")}
            </p>
          </div>

          {/* Largeur deduite de la hauteur libre : le film reste entier sans scroll,
              meme sur un portable 1366x768. Plafonne par le conteneur (max-w-5xl). */}
          <div
            className="mx-auto"
            style={{ width: "min(100%, calc((100dvh - 15rem) * 16 / 9))" }}
          >
            <FilmPlayer
              src="/motion-design/plume-teaser.mp4"
              poster="/motion-design/plume-poster.jpg"
              label={t("player.label")}
              playLabel={t("player.play")}
              fallback={t("player.fallback")}
              autoHighlight
            />
          </div>

          <p className="mt-5 text-sm text-muted-foreground text-center">
            {t("player.soundHint")}
          </p>
        </div>
      </section>

      {/* Le projet en bref */}
      <section className="py-16 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-border bg-white p-5 text-center"
                >
                  <p className="text-xl font-bold text-foreground tracking-tight">
                    {fact.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{fact.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <AnimateOnScroll>
              <div>
                <p className="section-tag">{t("brief.tag")}</p>
                <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                  {t("brief.title")}
                </h2>
                <p className="text-secondary-foreground leading-relaxed mb-4">
                  {t("brief.paragraph1")}
                </p>
                <p className="text-secondary-foreground leading-relaxed">
                  {t("brief.paragraph2")}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120}>
              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {t("madeWith.title")}
                </h3>
                <ul className="space-y-3">
                  {madeWith.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary-foreground leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-secondary-foreground text-lg mb-8 leading-relaxed">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow"
              >
                <Link href="/motion-design">
                  {t("cta.offer")}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-secondary-foreground hover:bg-secondary hover:text-foreground px-8 gap-2"
              >
                <Link href="/contact">{t("cta.quote")}</Link>
              </Button>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 mt-10 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors"
            >
              <ArrowLeft size={14} />
              {t("cta.back")}
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
