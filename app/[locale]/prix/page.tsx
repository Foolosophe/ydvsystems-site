"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Clock, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { SOLUTIONS } from "@/lib/data"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

export default function PrixPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const t = useTranslations("pricing")
  const td = useTranslations("data.solutions")

  const COMMON_FEATURES = t.raw("commonFeatures.features") as string[]
  const FAQ = t.raw("faq.items") as { question: string; answer: string }[]

  return (
    <main className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />

      {/* Header */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag">{t("header.tag")}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8">
            {t("header.description")}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-secondary border border-border rounded-full p-1">
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {t("toggle.annual")}
              {isAnnual && <span className="ml-1.5 text-xs text-primary font-semibold">{t("toggle.discount")}</span>}
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {t("toggle.monthly")}
            </button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((solution, i) => {
              const isProd = solution.status === "prod"
              const displayPrice = isAnnual ? solution.priceValue : solution.priceMonthly
              return (
                <AnimateOnScroll key={solution.slug} delay={i * 80}>
                  <Card
                    className={`bg-white overflow-hidden transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 h-full ${
                      isProd ? "border-2 shadow-(--shadow-card)" : "border-border"
                    }`}
                    style={isProd ? { borderColor: `${solution.color}60` } : undefined}
                  >
                    <div className="h-1 w-full" style={{ background: solution.color }} />

                    {isProd && (
                      <div className="bg-linear-to-r from-teal-50 to-transparent px-6 py-1.5">
                        <span className="text-xs font-semibold text-teal-700">{t("card.recommended")}</span>
                      </div>
                    )}

                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-foreground">{solution.name}</h3>
                          <Badge
                            className="text-[10px]"
                            style={
                              isProd
                                ? { backgroundColor: `${solution.color}15`, color: solution.color, borderColor: `${solution.color}30` }
                                : undefined
                            }
                            variant={isProd ? "default" : "secondary"}
                          >
                            {isProd ? <><CheckCircle2 size={10} className="mr-0.5" /> {t("card.statusProd")}</> : <><Clock size={10} className="mr-0.5" /> {t("card.statusSoon")}</>}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{td(`${solution.slug}.subtitle`)}</p>
                      </div>

                      <div className="mb-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground">{displayPrice} &euro;</span>
                          <span className="text-sm text-muted-foreground">{t("card.perMonth")}</span>
                        </div>
                        {isAnnual && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("card.annualTotal", { total: displayPrice * 12 })} &middot; <span className="line-through">{t("card.monthlyStrike", { price: solution.priceMonthly })}</span>
                          </p>
                        )}
                        {!isAnnual && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            {t("card.monthlyHint", { price: solution.priceValue })}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-secondary-foreground leading-relaxed mb-6 flex-1 mt-3">
                        {td(`${solution.slug}.description`)}
                      </p>

                      <Button
                        asChild
                        className="w-full text-foreground font-bold gap-2"
                        style={{ backgroundColor: solution.color }}
                      >
                        <Link href={`/solutions/${solution.slug}`}>
                          {isProd ? t("card.learnMore") : t("card.preRegistration")}
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Common features */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("commonFeatures.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">
                {t("commonFeatures.title")}
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMON_FEATURES.map((feature, i) => (
              <AnimateOnScroll key={feature} delay={i * 50}>
                <div className="flex items-center gap-3 bg-white border border-border rounded-lg p-3">
                  <Check size={16} className="text-primary shrink-0" />
                  <span className="text-sm text-secondary-foreground">{feature}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("faq.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">{t("faq.title")}</h2>
            </div>
          </AnimateOnScroll>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <AnimateOnScroll key={item.question} delay={i * 80}>
                <div className="bg-white border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{item.answer}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-secondary-foreground mb-8">
              {t("cta.description")}
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2">
              <Link href="/contact">
                {t("cta.button")}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
