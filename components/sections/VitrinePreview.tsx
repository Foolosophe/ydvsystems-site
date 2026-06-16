"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

const FEATURE_KEYS = ["feature1", "feature2", "feature3"] as const

export function VitrinePreview() {
  const t = useTranslations("home.vitrine")

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="relative rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-(--shadow-glow)">
            <div
              className="h-1 w-full solution-brand-underline"
              style={{ "--solution-color": "#00bcd4" } as React.CSSProperties}
            />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-10 lg:p-12">
              <div>
                <Badge className="badge-pulse bg-teal-50 text-teal-700 border-teal-200 mb-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {t("badge")}
                  </span>
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                  {t("title")}
                </h2>
                <p className="text-secondary-foreground text-lg leading-relaxed mb-6">
                  {t("description")}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 shadow-(--shadow-glow) hover:shadow-none transition-all"
                >
                  <Link href="/vitrine-ecommerce">
                    {t("cta")}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>

              <ul className="space-y-4">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
