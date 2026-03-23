import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
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
  Quote,
  MapPin,
  Briefcase,
  ClipboardList,
  Building2,
  TrendingUp,
  UserCheck,
  FileSignature,
  Wallet,
  GraduationCap,
  Star,
  Eye,
  DoorOpen,
  Receipt,
  Package,
  LifeBuoy,
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
  MapPin: <MapPin size={24} />,
  Briefcase: <Briefcase size={24} />,
  ClipboardList: <ClipboardList size={24} />,
  Building2: <Building2 size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  UserCheck: <UserCheck size={24} />,
  FileSignature: <FileSignature size={24} />,
  Wallet: <Wallet size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  Star: <Star size={24} />,
  Eye: <Eye size={24} />,
  DoorOpen: <DoorOpen size={24} />,
  Receipt: <Receipt size={24} />,
  Package: <Package size={24} />,
  LifeBuoy: <LifeBuoy size={24} />,
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

  const heroTitle = td(`${slug}.heroTitle`)
  const heroSubtitle = td(`${slug}.heroSubtitle`)
  const painPoints = td.raw(`${slug}.painPoints`) as string[]
  const features = td.raw(`${slug}.features`) as { title: string; description: string }[]
  const pricingPrice = td(`${slug}.pricingPrice`)
  const pricingUnit = td(`${slug}.pricingUnit`)
  const pricingTrial = td(`${slug}.pricingTrial`)

  const hasTestimonial = SOLUTIONS_WITH_TESTIMONIAL.includes(slug)
  const testimonialQuote = hasTestimonial ? td(`${slug}.testimonialQuote`) : null
  const testimonialAuthor = hasTestimonial ? td(`${slug}.testimonialAuthor`) : null
  const testimonialRole = hasTestimonial ? td(`${slug}.testimonialRole`) : null

  const featureIcons = SOLUTION_FEATURE_ICONS[slug] || []

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
      availability: "https://schema.org/InStock",
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
            className="mb-4 badge-pulse"
            style={{
              backgroundColor: `${solution.color}15`,
              color: solution.color,
              borderColor: `${solution.color}30`,
            }}
          >
            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t("inProduction")}</span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-foreground font-bold px-8 gap-2" style={{ backgroundColor: solution.color }}>
              <a href={solution.url!} target="_blank" rel="noopener noreferrer">
                {t("freeTrial")}
                <ArrowRight size={18} />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold px-8 gap-2">
              <Link href="/contact">
                {t("requestDemo")}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          {pricingTrial && (
            <p className="text-sm text-muted-foreground mt-4">{pricingTrial}</p>
          )}
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-tag" style={{ color: solution.color }}>{t("painPointsTag")}</p>
            <h2 className="text-2xl font-bold text-foreground">{t("painPointsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {painPoints.map((point) => (
              <Card key={point} className="bg-white border-border">
                <CardContent className="p-5 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-secondary-foreground leading-relaxed">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-primary font-semibold">{t("painPointsSolved")}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag" style={{ color: solution.color }}>{t("featuresTag")}</p>
            <h2 className="text-3xl font-bold text-foreground">
              {t("featuresTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={feature.title} className="bg-white border-border hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200 group">
                <CardContent className="p-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 solution-icon-box"
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

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag" style={{ color: solution.color }}>{t("pricingTag")}</p>
          <div className="bg-white border-2 rounded-2xl p-8 shadow-(--shadow-card)" style={{ borderColor: `${solution.color}40` }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">{solution.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-foreground">{pricingPrice}</span>
              <span className="text-secondary-foreground">{pricingUnit}</span>
            </div>
            {pricingTrial && (
              <p className="text-sm text-muted-foreground mb-6">{pricingTrial}</p>
            )}
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full text-foreground font-bold gap-2" style={{ backgroundColor: solution.color }}>
                <a href={solution.url!} target="_blank" rel="noopener noreferrer">
                  {t("freeTrial")}
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full font-bold gap-2">
                <Link href="/contact">
                  {t("requestDemo")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
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
          <Link href="/prix" className="inline-flex items-center gap-2 text-sm transition-colors font-semibold hover:opacity-80" style={{ color: solution.color }}>
            {t("comparePricing")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  )
}
