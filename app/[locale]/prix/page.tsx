"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Zap, Shield, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { SOLUTIONS } from "@/lib/data"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

type BillingPeriod = "monthly" | "quarterly" | "annual"

function getMultiplier(period: BillingPeriod): number {
  if (period === "annual") return 0.8
  if (period === "quarterly") return 0.9
  return 1
}

function applyDiscount(price: number, period: BillingPeriod): number {
  return Math.round(price * getMultiplier(period))
}

export default function PrixPage() {
  const [period, setPeriod] = useState<BillingPeriod>("annual")
  const t = useTranslations("pricing")

  const TIERS = ["solo", "starter", "pro", "business"] as const
  const FAQ = t.raw("faq.items") as { question: string; answer: string }[]
  const socleModules = t.raw("socle.modules") as string[]
  const tierRows = t.raw("tiers.rows") as { label: string; values: string[] }[]
  const tierHeaders = t.raw("tiers.headers") as string[]
  const optionItems = t.raw("options.items") as { label: string; price: string }[]
  const serviceItems = t.raw("services.items") as { label: string; description: string; price: string }[]
  const discountItems = t.raw("discounts.items") as { label: string; value: string; detail: string }[]
  const trialFeatures = t.raw("trial.features") as string[]
  const addonItems = t.raw("addons.items") as { name: string; description: string; solo: string; starter: string; pro: string; business: string }[]
  const multiCombos = t.raw("multiSolutions.combos") as { name: string; solo: string; starter: string; pro: string; business: string }[]
  const creditRecharges = t.raw("credits.recharges") as { credits: string; price: string }[]

  const solutionColors: Record<string, string> = {
    insertion: "#14b8a6",
    formation: "#6366f1",
    coaching: "#10b981",
  }

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

          {/* Toggle 3 positions */}
          <div className="inline-flex items-center gap-1 bg-secondary border border-border rounded-full p-1">
            <button
              onClick={() => setPeriod("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                period === "annual"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {t("toggle.annual")}
              {period === "annual" && <span className="ml-1.5 text-xs text-primary font-semibold">{t("toggle.discountAnnual")}</span>}
            </button>
            <button
              onClick={() => setPeriod("quarterly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                period === "quarterly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {t("toggle.quarterly")}
              {period === "quarterly" && <span className="ml-1.5 text-xs text-primary font-semibold">{t("toggle.discountQuarterly")}</span>}
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                period === "monthly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {t("toggle.monthly")}
            </button>
          </div>
        </div>
      </section>

      {/* Socle commun */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("socle.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("socle.title")}</h2>
              <p className="text-secondary-foreground">{t("socle.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {socleModules.map((mod, i) => (
              <AnimateOnScroll key={mod} delay={i * 30}>
                <div className="flex items-start gap-3 bg-white border border-border rounded-lg p-3">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-secondary-foreground">{mod}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TIERS.map((tier) => (
                <div key={tier} className="bg-white border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{tier}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applyDiscount(Number(t(`socle.${tier}`)), period)} &euro;
                  </p>
                  <p className="text-xs text-muted-foreground">{t("perMonth")}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Packs Solutions */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("packs.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("packs.title")}</h2>
              <p className="text-secondary-foreground">{t("packs.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(["insertion", "formation", "coaching"] as const).map((slug, i) => {
              const color = solutionColors[slug]
              return (
                <AnimateOnScroll key={slug} delay={i * 100}>
                  <Card className="bg-white overflow-hidden border-2 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-200 h-full" style={{ borderColor: `${color}40` }}>
                    <div className="h-1 w-full" style={{ backgroundColor: color }} />
                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold text-foreground mb-1">{t(`packs.${slug}.name`)}</h3>
                      <p className="text-xs font-semibold mb-1" style={{ color }}>{t(`packs.${slug}.modules`)}</p>
                      <p className="text-xs text-muted-foreground mb-4">{t(`packs.${slug}.specifics`)}</p>

                      <div className="space-y-2 mb-6 flex-1">
                        {TIERS.map((tier) => (
                          <div key={tier} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                            <span className="text-sm text-secondary-foreground capitalize">{tier}</span>
                            <span className="font-bold text-foreground">
                              {applyDiscount(Number(t(`packs.${slug}.${tier}`)), period)} &euro;{t("packs.perMonth")}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-secondary-foreground">Enterprise</span>
                          <span className="font-bold text-foreground">{t("enterprise")}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full text-foreground font-bold gap-2" style={{ backgroundColor: color }}>
                          <a href={SOLUTIONS.find(s => s.slug === slug)?.url ?? "#"} target="_blank" rel="noopener noreferrer">
                            {t("packs.freeTrial")}
                            <ArrowRight size={14} />
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full gap-1">
                          <Link href={`/solutions/${slug}`}>
                            {t("packs.learnMore")}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* YDV Manager */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag" style={{ color: "#f59e0b" }}>{t("manager.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("manager.title")}</h2>
              <p className="text-secondary-foreground">{t("manager.description")}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <Card className="bg-white border-2 overflow-hidden" style={{ borderColor: "#f59e0b40" }}>
              <div className="h-1 w-full" style={{ backgroundColor: "#f59e0b" }} />
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">{t("manager.features")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {TIERS.map((tier) => (
                    <div key={tier} className="text-center">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{tier}</p>
                      <p className="text-xl font-bold text-foreground">
                        {applyDiscount(Number(t(`manager.${tier}`)), period)} &euro;
                      </p>
                      <p className="text-xs text-muted-foreground">{t("manager.perMonth")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="text-foreground font-bold gap-2" style={{ backgroundColor: "#f59e0b" }}>
                    <a href="https://manager.ydvsystems.com" target="_blank" rel="noopener noreferrer">
                      {t("manager.freeTrial")}
                      <ArrowRight size={14} />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-1">
                    <Link href="/solutions/manager">{t("manager.learnMore")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Multi-solutions */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("multiSolutions.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("multiSolutions.title")}</h2>
              <p className="text-secondary-foreground max-w-2xl mx-auto">{t("multiSolutions.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-3">
            {multiCombos.map((combo, i) => (
              <AnimateOnScroll key={combo.name} delay={i * 60}>
                <div className="bg-white border border-border rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{combo.name}</h3>
                    <div className="flex gap-4 flex-wrap">
                      {TIERS.map((tier) => (
                        <div key={tier} className="text-center min-w-17.5">
                          <p className="text-[10px] text-muted-foreground uppercase">{tier}</p>
                          <p className="font-bold text-foreground">
                            {applyDiscount(Number(combo[tier]), period)} &euro;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Pack Ultime */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200">
                <Sparkles size={12} className="mr-1" /> {t("packUltime.tag")}
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("packUltime.title")}</h2>
              <p className="text-secondary-foreground">{t("packUltime.description")}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TIERS.map((tier) => (
                <div key={tier} className="bg-white border-2 border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{tier}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applyDiscount(Number(t(`packUltime.${tier}`)), period)} &euro;
                  </p>
                  <p className="text-xs text-muted-foreground">{t("packUltime.perMonth")}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Addons */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("addons.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("addons.title")}</h2>
              <p className="text-secondary-foreground">{t("addons.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {addonItems.map((addon, i) => (
              <AnimateOnScroll key={addon.name} delay={i * 100}>
                <Card className="bg-white border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={18} className="text-primary" />
                      <h3 className="font-semibold text-foreground">{addon.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TIERS.map((tier) => (
                        <div key={tier} className="text-center bg-secondary rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground uppercase">{tier}</p>
                          <p className="font-bold text-foreground text-sm">{addon[tier]} &euro;{t("addons.perMonth")}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Crédits IA */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("credits.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("credits.title")}</h2>
              <p className="text-secondary-foreground">{t("credits.description")}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              {(["solo", "starter", "pro", "business", "enterprise"] as const).map((tier) => (
                <div key={tier} className="bg-white border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{tier}</p>
                  <p className="text-xl font-bold text-foreground">{t(`credits.included.${tier}`)}</p>
                  <p className="text-xs text-muted-foreground">{t("credits.perMonth")}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">{t("credits.rechargeTitle")}</h3>
              <div className="grid grid-cols-3 gap-4">
                {creditRecharges.map((pack) => (
                  <div key={pack.credits} className="text-center bg-secondary rounded-lg p-3">
                    <p className="font-bold text-foreground">{pack.credits} {t("credits.rechargeUnit")}</p>
                    <p className="text-sm text-primary font-semibold">{pack.price} &euro;</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Tailles de structure */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("tiers.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">{t("tiers.title")}</h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {tierHeaders.map((header, i) => (
                      <th key={i} className="py-3 px-4 text-left font-semibold text-foreground">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tierRows.map((row) => (
                    <tr key={row.label} className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className="py-3 px-4 text-secondary-foreground">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("options.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">{t("options.title")}</h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {optionItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={i * 50}>
                <div className="flex items-center justify-between bg-white border border-border rounded-lg p-4">
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-primary">{item.price}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Services premium */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("services.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground">{t("services.title")}</h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-3">
            {serviceItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={i * 60}>
                <div className="bg-white border border-border rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="font-bold text-primary whitespace-nowrap">{item.price}</span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Remises */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("discounts.tag")}</p>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("discounts.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("discounts.description")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discountItems.map((item, i) => (
              <AnimateOnScroll key={item.label} delay={i * 40}>
                <div className="flex items-center justify-between bg-white border border-border rounded-lg p-4">
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    {item.detail && <span className="text-xs text-muted-foreground ml-2">({item.detail})</span>}
                  </div>
                  <Badge variant="secondary" className="font-bold">{item.value}</Badge>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Essai gratuit */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <Card className="bg-white border-2 border-primary/30 overflow-hidden">
              <CardContent className="p-8 text-center">
                <Shield size={32} className="mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-2">{t("trial.title")}</h2>
                <p className="text-secondary-foreground mb-6">{t("trial.description")}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
                  {trialFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check size={16} className="text-primary shrink-0" />
                      <span className="text-sm text-secondary-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-primary font-semibold mb-6">{t("trial.earlyAdopter")}</p>

                <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-bold px-8 gap-2">
                  <Link href="/contact">
                    {t("trial.cta")}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary">
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
      <section className="py-16">
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
