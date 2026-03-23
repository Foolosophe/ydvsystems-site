import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code2, Eye, Zap, Shield } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { StatsGrid } from "@/components/StatsGrid"
import { TechStack } from "@/components/TechStack"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

const VALUE_ICONS = [Code2, Eye, Zap, Shield]

export default async function AboutPage() {
  const t = await getTranslations("about")
  const values = t.raw("values.items") as { title: string; description: string }[]

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <Image
                src="/images/yohann.jpg"
                alt="Yohann Dandeville"
                width={160}
                height={160}
                className="rounded-2xl object-cover border-2 border-primary/20 shadow-lg shrink-0"
                priority
              />
              <div>
                <p className="section-tag">{t("hero.tag")}</p>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-lg text-primary font-medium mb-4">
                  {t("hero.role")}
                </p>
                <p className="text-lg text-secondary-foreground leading-relaxed">
                  {t("hero.intro")}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Parcours */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <p className="section-tag">{t("story.tag")}</p>
            <h2 className="text-2xl font-bold text-foreground mb-8">{t("story.title")}</h2>
          </AnimateOnScroll>
          <div className="space-y-5">
            {(["p1", "p2", "p3", "p4"] as const).map((key, i) => (
              <AnimateOnScroll key={key} delay={i * 80}>
                <p className="text-secondary-foreground leading-relaxed">{t(`story.${key}`)}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <StatsGrid />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <p className="section-tag">{t("values.tag")}</p>
            <h2 className="text-2xl font-bold text-foreground mb-8">{t("values.title")}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i]
              return (
                <AnimateOnScroll key={value.title} delay={i * 80}>
                  <Card className="bg-white border-border h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">{value.title}</h3>
                      </div>
                      <p className="text-sm text-secondary-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <TechStack />
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
            <p className="text-secondary-foreground mb-8">{t("cta.description")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 btn-glow">
                <Link href="/contact">
                  {t("cta.contact")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/solutions">
                  {t("cta.solutions")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
