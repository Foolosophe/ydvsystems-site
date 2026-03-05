"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowRight, Code2, Brain, GraduationCap, ClipboardCheck } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { SERVICE_PREVIEW_IDS, SERVICE_ICONS, SERVICE_TECH_TAGS } from "@/lib/data"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

const ICONS: Record<string, React.ReactNode> = {
  Code2: <Code2 size={24} />,
  Brain: <Brain size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />,
}

export function FreelancePreview() {
  const t = useTranslations("home.freelance")
  const td = useTranslations("data.services")

  return (
    <section id="prestations" className="py-20 sm:py-28 bg-secondary">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICE_PREVIEW_IDS.map((id, i) => (
            <AnimateOnScroll key={id} delay={i * 100}>
              <Card className="bg-white border-border overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group h-full">
                <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors solution-icon-box">
                    {ICONS[SERVICE_ICONS[id]]}
                  </div>
                  <h3 className="font-semibold text-foreground text-base leading-snug">
                    {td(`${id}.title`)}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {td(`${id}.description`)}
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
                    <span className="text-sm font-semibold text-primary">{td(`${id}.price`)}</span>
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={400}>
          <div className="text-center mt-10">
            <Link
              href="/prestations"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-(--accent-hover) font-semibold transition-colors"
            >
              {t("allServices")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
