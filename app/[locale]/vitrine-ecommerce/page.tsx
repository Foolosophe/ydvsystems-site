import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, CheckCircle2, Clock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { getPageAlternates } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("vitrineEcommerce.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "vitrine-ecommerce"),
  }
}

export default async function VitrineEcommercePage() {
  const t = await getTranslations("vitrineEcommerce")

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="section-tag">{t("hero.tag")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Offers grid */}
      <section className="py-16 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Vitrine — live */}
            <AnimateOnScroll>
              <Card className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-200 group h-full">
                <div
                  className="h-1 w-full solution-brand-underline"
                  style={{ "--solution-color": "#00bcd4" } as React.CSSProperties}
                />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{t("cards.vitrine.title")}</h2>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("cards.vitrine.subtitle")}
                      </p>
                    </div>
                    <Badge className="badge-pulse bg-teal-50 text-teal-700 border-teal-200 shrink-0">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {t("cards.vitrine.badge")}
                      </span>
                    </Badge>
                  </div>

                  <p className="text-sm text-secondary-foreground leading-relaxed mb-4">
                    {t("cards.vitrine.description")}
                  </p>

                  <a
                    href="https://presence-pro.ydvsystems.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors group-hover:gap-2"
                  >
                    {t("cards.vitrine.cta")}
                    <ExternalLink size={14} />
                  </a>
                </CardContent>
              </Card>
            </AnimateOnScroll>

            {/* YDVshop — coming soon */}
            <AnimateOnScroll delay={100}>
              <Card className="bg-white border-border overflow-hidden h-full">
                <div className="h-1 w-full" style={{ backgroundColor: "#cbd5e1" }} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{t("cards.shop.title")}</h2>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("cards.shop.subtitle")}
                      </p>
                    </div>
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {t("cards.shop.badge")}
                      </span>
                    </Badge>
                  </div>

                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {t("cards.shop.description")}
                  </p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
            <p className="text-secondary-foreground mb-6">{t("cta.description")}</p>
            <Button
              asChild
              className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 btn-glow"
            >
              <Link href="/contact">
                {t("cta.contact")}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
