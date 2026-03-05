import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { SOLUTIONS } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("solutionsIndex.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function SolutionsPage() {
  const t = await getTranslations("solutionsIndex")
  const td = await getTranslations("data.solutions")

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

      {/* Solutions grid */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SOLUTIONS.map((solution, i) => {
              const isProd = solution.status === "prod"
              return (
                <AnimateOnScroll key={solution.slug} delay={i * 100}>
                <Card
                  className="bg-white border-border overflow-hidden hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-200 group h-full"
                >
                  <div
                    className="h-1 w-full solution-brand-underline"
                    style={{ "--solution-color": solution.color } as React.CSSProperties}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{solution.name}</h2>
                        <p className="text-sm font-medium text-muted-foreground">
                          {td(`${solution.slug}.subtitle`)}
                        </p>
                      </div>
                      <Badge
                        className={`badge-pulse ${
                          isProd
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {isProd ? (
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
                        <span className="text-lg font-bold text-foreground">
                          {td(`${solution.slug}.price`)}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {td(`${solution.slug}.priceUnit`)}
                        </span>
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
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
          <p className="text-secondary-foreground mb-6">{t("cta.description")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 btn-glow">
              <Link href="/contact">
                {t("cta.contact")}
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Link
              href="/prix"
              className="text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors"
            >
              {t("cta.pricing")} &rarr;
            </Link>
          </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
