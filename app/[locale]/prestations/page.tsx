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
  ArrowRight,
} from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
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
  MonitorSmartphone: <MonitorSmartphone size={24} />,
  Gamepad2: <Gamepad2 size={24} />,
  Heart: <Heart size={24} />,
}

export default async function PrestationsPage() {
  const t = await getTranslations("prestations")
  const tSrv = await getTranslations("data.services")

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

      {/* Services grid */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={t("services.tag")}
            title={t("services.title")}
            description={t("services.description")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICE_IDS.map((id, i) => (
              <AnimateOnScroll key={id} delay={i * 100}>
              <Card
                className="bg-white border-border overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group h-full"
              >
                <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors solution-icon-box">
                    {ICONS[SERVICE_ICONS[id]]}
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
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{tSrv(`${id}.price`)}</span>
                  </div>
                </CardContent>
              </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
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
