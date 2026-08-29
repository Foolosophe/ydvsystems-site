import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Play,
  Check,
  CheckCircle2,
  PenLine,
  Clapperboard,
  Music,
  Package,
  Smartphone,
  Store,
  BookOpen,
  Briefcase,
  Users,
  TrendingUp,
  Mail,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { getPageAlternates, localeUrl } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("motionDesign.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "motion-design"),
  }
}

const INCLUDED_ICONS = [PenLine, Clapperboard, Music, Package]
const USE_CASE_ICONS = [Smartphone, Store, BookOpen, Briefcase, Users, TrendingUp]

// Prix numeriques pour le JSON-LD — les libelles traduits ne sont pas parsables
const OFFER_PRICES: (string | null)[] = ["990", "1690", null]

type Stat = { value: string; label: string }
type IncludedItem = { title: string; description: string }
type Plan = {
  name: string
  price: string
  priceSuffix: string
  tagline: string
  features: string[]
  cta: string
}
type Step = { day: string; title: string; description: string }

export default async function MotionDesignPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("motionDesign")

  const reassurance = t.raw("hero.reassurance") as string[]
  const stats = t.raw("stats") as Stat[]
  const includedItems = t.raw("included.items") as IncludedItem[]
  const plans = t.raw("pricing.plans") as Plan[]
  const steps = t.raw("process.steps") as Step[]
  const useCases = t.raw("useCases.items") as string[]

  return (
    <main className="min-h-screen pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${t("hero.title1")}${t("hero.titleHighlight")}${t("hero.title2")}`,
            description: t("meta.description"),
            serviceType: "Motion design",
            url: localeUrl(locale, "/motion-design"),
            provider: {
              "@type": "Person",
              name: "Yohann Dandeville",
              url: localeUrl(locale),
            },
            areaServed: "FR",
            hasPart: {
              "@type": "VideoObject",
              name: t("example.title"),
              description: t("example.meta"),
              thumbnailUrl: `${localeUrl("fr").replace(/\/$/, "")}/motion-design/plume-poster.jpg`,
              contentUrl: `${localeUrl("fr").replace(/\/$/, "")}/motion-design/plume-teaser.mp4`,
              uploadDate: "2026-06-22",
              duration: "PT48S",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: t("pricing.title"),
              itemListElement: plans.map((plan, i) => ({
                "@type": "Offer",
                name: plan.name,
                url: localeUrl(locale, "/motion-design"),
                ...(OFFER_PRICES[i]
                  ? { price: OFFER_PRICES[i], priceCurrency: "EUR" }
                  : {}),
                itemOffered: {
                  "@type": "Service",
                  name: plan.name,
                  description: plan.tagline,
                },
              })),
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="section-tag">{t("hero.tag")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              {t("hero.title1")}
              <span className="text-gradient">{t("hero.titleHighlight")}</span>
              {t("hero.title2")}
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow"
              >
                <Link href="/contact">
                  {t("hero.ctaPrimary")}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-secondary-foreground hover:bg-secondary hover:text-foreground px-8 gap-2"
              >
                <a href="#exemple">
                  <Play size={16} />
                  {t("hero.ctaSecondary")}
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {reassurance.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground"
                >
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Exemple reel — le film Plume */}
      <section id="exemple" className="py-20 bg-secondary scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="section-tag">{t("example.tag")}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {t("example.title")}
                </h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground sm:text-right">
                {t("example.meta")}
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border shadow-(--shadow-card-hover) bg-black">
              <div className="relative w-full pt-[56.25%]">
                <video
                  controls
                  playsInline
                  preload="none"
                  poster="/motion-design/plume-poster.jpg"
                  aria-label={t("example.videoTitle")}
                  className="absolute inset-0 w-full h-full"
                >
                  <source src="/motion-design/plume-teaser.mp4" type="video/mp4" />
                  <a href="/motion-design/plume-teaser.mp4">{t("example.fallback")}</a>
                </video>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Chiffres cles */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.value} delay={i * 80}>
                <div className="text-center px-4">
                  <p
                    className={`text-4xl font-bold tracking-tight mb-2 ${
                      i === 0 ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tout est inclus */}
      <section className="py-20 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="section-tag">{t("included.tag")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t("included.title")}
              </h2>
              <p className="text-secondary-foreground text-lg leading-relaxed">
                {t("included.subtitle")}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {includedItems.map((item, i) => {
              const Icon = INCLUDED_ICONS[i]
              return (
                <AnimateOnScroll key={item.title} delay={i * 80}>
                  <Card className="bg-white border-border overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group h-full">
                    <div
                      className="h-1 w-full solution-brand-underline"
                      style={{ "--solution-color": "#00bcd4" } as React.CSSProperties}
                    />
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors solution-icon-box">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-secondary-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="section-tag">{t("pricing.tag")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t("pricing.title")}
              </h2>
              <p className="text-secondary-foreground text-lg leading-relaxed">
                {t("pricing.subtitle")}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => {
              const featured = i === 1
              return (
                <AnimateOnScroll key={plan.name} delay={i * 80}>
                  <div
                    className={`relative h-full flex flex-col rounded-xl border bg-white p-8 transition-all duration-200 ${
                      featured
                        ? "border-primary/40 shadow-(--shadow-glow) lg:-translate-y-2"
                        : "border-border hover:border-primary/30 hover:shadow-(--shadow-card-hover)"
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold text-foreground">
                        {t("pricing.recommended")}
                      </span>
                    )}

                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {plan.name}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground tracking-tight">
                        {plan.price}
                      </span>
                      {plan.priceSuffix && (
                        <span className="text-sm font-medium text-muted-foreground">
                          {plan.priceSuffix}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-medium text-secondary-foreground">
                      {plan.tagline}
                    </p>

                    <div className="h-px bg-border my-6" />

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check size={16} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-secondary-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex-1" />

                    <Button
                      asChild
                      size="lg"
                      variant={featured ? "default" : "outline"}
                      className={`mt-8 w-full font-semibold gap-2 ${
                        featured
                          ? "bg-primary hover:bg-(--accent-hover) text-foreground btn-glow"
                          : "border-border text-secondary-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Link href="/contact">
                        {plan.cta}
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>

          <AnimateOnScroll delay={280}>
            <p className="mt-10 text-center text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("pricing.note")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Process 5 jours */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="section-tag">{t("process.tag")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t("process.title")}
              </h2>
              <p className="text-secondary-foreground text-lg leading-relaxed">
                {t("process.subtitle")}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map((step, i) => (
              <AnimateOnScroll key={step.day} delay={i * 80}>
                <div className="h-full rounded-xl border border-border bg-white p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-(--shadow-card-hover) hover:-translate-y-1">
                  <p className="text-3xl font-bold text-primary leading-none mb-3">
                    {i + 1}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {step.day}
                  </h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="section-tag">{t("useCases.tag")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t("useCases.title")}
              </h2>
              <p className="text-secondary-foreground text-lg leading-relaxed">
                {t("useCases.subtitle")}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((useCase, i) => {
              const Icon = USE_CASE_ICONS[i]
              return (
                <AnimateOnScroll key={useCase} delay={i * 80}>
                  <div className="h-full flex items-center gap-4 rounded-xl border border-border bg-secondary p-6 transition-all duration-200 hover:border-primary/30 hover:bg-white hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group">
                    <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center shrink-0 solution-icon-box">
                      <Icon size={24} />
                    </div>
                    <p className="text-base font-semibold text-foreground leading-snug">
                      {useCase}
                    </p>
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-secondary-foreground text-lg mb-8 leading-relaxed">
              {t("cta.description")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow"
            >
              <Link href="/contact">
                {t("cta.button")}
                <ArrowRight size={18} />
              </Link>
            </Button>

            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">{t("cta.emailLabel")}</p>
              <a
                href="mailto:contact@ydvsystems.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-(--accent-hover) transition-colors"
              >
                <Mail size={16} />
                contact@ydvsystems.com
              </a>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">{t("cta.response")}</p>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
