"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { PORTFOLIO_PREVIEW_IDS, PORTFOLIO_TECH } from "@/lib/data"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

export function PortfolioPreview() {
  const t = useTranslations("home.portfolio")
  const tPort = useTranslations("data.portfolio")

  return (
    <section className="py-20 sm:py-28 bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <p className="section-tag">{t("tag")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("title")}
            </h2>
            <p className="text-secondary-foreground max-w-xl mx-auto text-lg">
              {t("description")}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PORTFOLIO_PREVIEW_IDS.map((id, i) => {
            const tech = PORTFOLIO_TECH[id]
            return (
              <AnimateOnScroll key={id} delay={i * 100}>
                <Card className="bg-white border-border overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-(--shadow-card-hover) card-tilt group h-full">
                  <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                  <CardHeader className="pb-3">
                    <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-2 w-fit">
                      {tPort(`${id}.type`)}
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground">{tPort(`${id}.title`)}</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-secondary-foreground leading-relaxed">{tPort(`${id}.description`)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-(--accent-subtle) text-primary font-semibold border-primary/20 text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            )
          })}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="text-center mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors"
            >
              {t("allProjects")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
