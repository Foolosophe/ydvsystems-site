import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Brain,
  BarChart3,
  Shield,
  FileText,
  BookOpen,
  CheckSquare,
  Award,
  Target,
  ClipboardCheck,
  CreditCard,
  Plug,
  Quote,
  Mail,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { SOLUTION_FEATURE_ICONS, SOLUTION_SLUGS, SOLUTIONS_WITH_TESTIMONIAL } from "../data"
import { SOLUTIONS } from "@/lib/data"

const ICONS: Record<string, React.ReactNode> = {
  Users: <Users size={24} />,
  Calendar: <Calendar size={24} />,
  Brain: <Brain size={24} />,
  BarChart3: <BarChart3 size={24} />,
  Shield: <Shield size={24} />,
  FileText: <FileText size={24} />,
  BookOpen: <BookOpen size={24} />,
  CheckSquare: <CheckSquare size={24} />,
  Award: <Award size={24} />,
  Target: <Target size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />,
  CreditCard: <CreditCard size={24} />,
  Plug: <Plug size={24} />,
}

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const solution = SOLUTIONS.find((s) => s.slug === slug)
  const t = await getTranslations("solutions.common")
  if (!solution) return { title: t("notFound") }

  const td = await getTranslations("data.solutionPages")
  const tagline = td(`${slug}.tagline`)
  const heroSubtitle = td(`${slug}.heroSubtitle`)

  return {
    title: `${solution.name} — ${tagline}`,
    description: heroSubtitle,
    openGraph: {
      title: `${solution.name} — ${tagline}`,
      description: heroSubtitle,
      url: `https://ydvsystems.com/solutions/${slug}`,
      siteName: "YdvSystems",
    },
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const solution = SOLUTIONS.find((s) => s.slug === slug)
  if (!solution) notFound()

  const t = await getTranslations("solutions.common")
  const td = await getTranslations("data.solutionPages")
  const isProd = solution.status === "prod"

  const heroTitle = td(`${slug}.heroTitle`)
  const heroSubtitle = td(`${slug}.heroSubtitle`)
  const features = td.raw(`${slug}.features`) as { title: string; description: string }[]
  const pricingPrice = td(`${slug}.pricingPrice`)
  const pricingUnit = td(`${slug}.pricingUnit`)

  const pricingTrial = td(`${slug}.pricingTrial`)

  const hasTestimonial = SOLUTIONS_WITH_TESTIMONIAL.includes(slug)
  const testimonialQuote = hasTestimonial ? td(`${slug}.testimonialQuote`) : null
  const testimonialAuthor = hasTestimonial ? td(`${slug}.testimonialAuthor`) : null
  const testimonialRole = hasTestimonial ? td(`${slug}.testimonialRole`) : null

  const featureIcons = SOLUTION_FEATURE_ICONS[slug] || []

  // Get timeline from translations
  let timeline: { step: string; date: string }[] | null = null
  if (!isProd) {
    try {
      const tt = await getTranslations("solutions.timeline")
      timeline = tt.raw(slug) as { step: string; date: string }[]
    } catch {
      timeline = null
    }
  }

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: solution.name,
    description: heroSubtitle,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: String(solution.priceValue),
      priceCurrency: "EUR",
      priceValidUntil: "2027-12-31",
      availability: isProd
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "YdvSystems", item: "https://ydvsystems.com" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://ydvsystems.com/#solutions" },
      { "@type": "ListItem", position: 3, name: solution.name, item: `https://ydvsystems.com/solutions/${slug}` },
    ],
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, breadcrumbJsonLd]) }}
      />

      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: `${solution.color}15`,
              color: solution.color,
              borderColor: `${solution.color}30`,
            }}
          >
            {isProd ? (
              <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t("inProduction")}</span>
            ) : (
              <span className="flex items-center gap-1"><Clock size={12} /> {t("comingSoon")}</span>
            )}
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isProd ? (
              <>
                <Button asChild size="lg" className="text-foreground font-bold px-8 gap-2" style={{ backgroundColor: solution.color }}>
                  <Link href="/contact">
                    {t("requestDemo")}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                {pricingTrial && (
                  <p className="text-sm text-muted-foreground">{pricingTrial}</p>
                )}
              </>
            ) : (
              <>
                <Button asChild size="lg" className="text-foreground font-bold px-8 gap-2" style={{ backgroundColor: solution.color }}>
                  <Link href="/contact">
                    {t("preRegistration")}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">{t("notifiedAtLaunch")}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">{t("featuresTag")}</p>
            <h2 className="text-3xl font-bold text-foreground">
              {t("featuresTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={feature.title} className="bg-white border-border hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${solution.color}15`, color: solution.color }}
                  >
                    {ICONS[featureIcons[idx]] ?? <CheckCircle2 size={24} />}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline (for "soon" solutions) */}
      {!isProd && timeline && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="section-tag">{t("timelineTag")}</p>
              <h2 className="text-2xl font-bold text-foreground">
                {t("timelineTitle")}
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-px" style={{ backgroundColor: `${solution.color}30` }} />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={item.step} className="flex items-start gap-4 relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground z-10"
                      style={{ backgroundColor: `${solution.color}20`, color: solution.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-semibold text-foreground">{item.step}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pre-registration CTA */}
              <div className="mt-12 bg-secondary border border-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${solution.color}15` }}>
                  <Mail size={20} style={{ color: solution.color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("earlyAccessTitle")}
                </h3>
                <p className="text-sm text-secondary-foreground mb-4">
                  {t("earlyAccessDescription")}
                </p>
                <Button asChild className="text-foreground font-bold gap-2" style={{ backgroundColor: solution.color }}>
                  <Link href="/contact">
                    {t("preRegistration")}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className={`py-16 ${!isProd && timeline ? "bg-secondary" : ""}`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag">{t("pricingTag")}</p>
          <div className="bg-white border-2 rounded-2xl p-8 shadow-(--shadow-card)" style={{ borderColor: `${solution.color}40` }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">{solution.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-foreground">{pricingPrice}</span>
              <span className="text-secondary-foreground">{pricingUnit}</span>
            </div>
            {pricingTrial && (
              <p className="text-sm text-muted-foreground mb-6">{pricingTrial}</p>
            )}
            <Button asChild className="w-full text-foreground font-bold gap-2" style={{ backgroundColor: solution.color }}>
              <Link href="/contact">
                {isProd ? t("requestDemo") : t("preRegistration")}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial (if available) */}
      {testimonialQuote && (
        <section className="py-16 bg-secondary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Quote size={32} className="mx-auto mb-4 text-muted-foreground" />
            <blockquote className="text-lg text-foreground leading-relaxed mb-4 italic">
              &ldquo;{testimonialQuote}&rdquo;
            </blockquote>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-secondary-foreground">{testimonialAuthor}</span>
              {" — "}{testimonialRole}
            </p>
          </div>
        </section>
      )}

      {/* Back navigation */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/#solutions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            {t("allSolutions")}
          </Link>
          <Link href="/prix" className="inline-flex items-center gap-2 text-sm text-primary hover:text-(--accent-hover) transition-colors font-semibold">
            {t("comparePricing")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  )
}
