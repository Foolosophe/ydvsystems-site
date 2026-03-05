"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { SOLUTIONS } from "@/lib/data"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

export function SolutionsGrid() {
  const t = useTranslations("home.solutions")
  const td = useTranslations("data.solutions")

  return (
    <section id="solutions" className="py-20 sm:py-28">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SOLUTIONS.map((solution, i) => (
            <AnimateOnScroll key={solution.slug} delay={i * 100}>
              <Card className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-200 group h-full">
                <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": solution.color } as React.CSSProperties} />

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{solution.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{td(`${solution.slug}.subtitle`)}</p>
                    </div>
                    <Badge
                      className={`badge-pulse ${
                        solution.status === "prod"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {solution.status === "prod" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {t("statusProd")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {t("statusSoon")}
                        </span>
                      )}
                    </Badge>
                  </div>

                  <p className="text-sm text-secondary-foreground leading-relaxed mb-4">
                    {td(`${solution.slug}.description`)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">{td(`${solution.slug}.price`)}</span>
                      <span className="text-sm font-medium text-muted-foreground">{td(`${solution.slug}.priceUnit`)}</span>
                    </div>
                    <Link
                      href={`/solutions/${solution.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors group-hover:gap-2"
                    >
                      {t("learnMore")}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={400}>
          <div className="text-center mt-10">
            <Link href="/prix" className="text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors">
              {t("allPricing")} &rarr;
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
