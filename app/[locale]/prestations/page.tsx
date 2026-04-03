import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Code2,
  Brain,
  GraduationCap,
  ClipboardCheck,
  Workflow,
  MonitorSmartphone,
  Gamepad2,
  Heart,
  CalendarClock,
  ArrowRight,
} from "lucide-react"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { SERVICE_IDS, SERVICE_ICONS, SERVICE_TECH_TAGS } from "@/lib/data"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("prestations.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

const ICONS: Record<string, React.ReactNode> = {
  Code2: <Code2 size={24} />,
  Brain: <Brain size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />,
  Workflow: <Workflow size={24} />,
  CalendarClock: <CalendarClock size={24} />,
  MonitorSmartphone: <MonitorSmartphone size={24} />,
  Gamepad2: <Gamepad2 size={24} />,
  Heart: <Heart size={24} />,
}

const EXPERTISE_IDS = ["dev-sur-mesure", "integration-ia", "atelier-ia", "audit-ia", "automatisation", "retainer"] as const
const OTHER_IDS = ["cross-platform", "jeux-narratifs", "accessibilite"] as const

function ServiceCard({ id, tSrv, badge, priceSub, large }: { id: string; tSrv: (key: string) => string; badge?: string; priceSub?: string; large?: boolean }) {
  return (
    <Card
      className={`bg-white border-border overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group h-full ${large ? "" : ""}`}
    >
      <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors solution-icon-box shrink-0">
            {ICONS[SERVICE_ICONS[id]]}
          </div>
          {badge && (
            <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-base leading-snug">
          {tSrv(`${id}.title`)}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-secondary-foreground leading-relaxed">
          {tSrv(`${id}.description`)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(SERVICE_TECH_TAGS[id] || []).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary text-muted-foreground border-0 text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="pt-1">
          <span className="text-sm font-semibold text-primary">{tSrv(`${id}.price`)}</span>
          {priceSub && (
            <p className="text-xs text-muted-foreground mt-1">{priceSub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function PrestationsPage() {
  const t = await getTranslations("prestations")
  const tSrv = await getTranslations("data.services")

  const processSteps = t.raw("process.steps") as { title: string; description: string }[]

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "YdvSystems",
            url: "https://ydvsystems.com",
            provider: {
              "@type": "Person",
              name: "Yohann Dandeville",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: t("services.title"),
              itemListElement: SERVICE_IDS.map((id) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: tSrv(`${id}.title`),
                  description: tSrv(`${id}.description`),
                },
              })),
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="section-tag">{t("hero.tag")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              {t("hero.title1")}<span className="text-gradient">{t("hero.titleHighlight")}</span>{t("hero.title2")}
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow">
              <Link href="/contact">
                {t("hero.cta")}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Expertise metier */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("services.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("expertiseTitle")}</h2>
              <p className="text-secondary-foreground">{t("services.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXPERTISE_IDS.map((id, i) => (
              <AnimateOnScroll key={id} delay={i * 80}>
                <ServiceCard
                  id={id}
                  tSrv={(key) => tSrv(key)}
                  priceSub={EXPERTISE_IDS.includes(id as typeof EXPERTISE_IDS[number]) ? tSrv(`${id}.priceSub`) : undefined}
                  badge={id === "retainer" ? tSrv("retainer.badge") : undefined}
                  large
                />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ca se passe */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="section-tag">{t("process.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">{t("process.title")}</h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <AnimateOnScroll key={step.title} delay={i * 80}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-secondary-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Autres competences */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-foreground">{t("otherTitle")}</h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {OTHER_IDS.map((id, i) => (
              <AnimateOnScroll key={id} delay={i * 80}>
                <ServiceCard id={id} tSrv={(key) => tSrv(key)} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <Link
              href="/prix"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors mb-10"
            >
              {t("cta.pricingLink")}
            </Link>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-secondary-foreground text-lg mb-8">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow">
                <Link href="/contact">
                  {t("cta.button")}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-secondary-foreground hover:bg-secondary hover:text-foreground px-8 gap-2">
                <Link href="/portfolio">
                  {t("cta.portfolioButton")}
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
