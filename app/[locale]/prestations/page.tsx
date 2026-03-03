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
  ExternalLink,
  Github,
} from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { SERVICE_IDS, SERVICE_ICONS, SERVICE_TECH_TAGS, PORTFOLIO_IDS, PORTFOLIO_TECH, STACK_CATEGORY_KEYS, STACK_TECHS, STATS } from "@/lib/data"
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

const STAT_KEYS = ["projects", "tests", "sectors", "platforms"] as const

export default async function PrestationsPage() {
  const t = await getTranslations("prestations")
  const ts = await getTranslations("home.stats")
  const tSrv = await getTranslations("data.services")
  const tPort = await getTranslations("data.portfolio")
  const tStack = await getTranslations("data.stack")

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag">{t("hero.tag")}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {t("hero.title1")}<span className="text-gradient">{t("hero.titleHighlight")}</span>{t("hero.title2")}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2">
            <Link href="/contact">
              {t("hero.cta")}
              <ArrowRight size={18} />
            </Link>
          </Button>
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
            {SERVICE_IDS.map((id) => (
              <Card
                key={id}
                className="bg-white border-border hover:border-primary/40 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group"
              >
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
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
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={t("portfolio.tag")}
            title={t("portfolio.title")}
            description={t("portfolio.description")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PORTFOLIO_IDS.map((id) => {
              const tech = PORTFOLIO_TECH[id]
              return (
                <Card
                  key={id}
                  className="bg-white border-border hover:border-primary/30 transition-all duration-200 hover:shadow-(--shadow-card-hover) hover:-translate-y-1 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-2">
                          {tPort(`${id}.type`)}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground">{tPort(`${id}.title`)}</h3>
                      </div>
                      {tech.url && (
                        <a
                          href={tech.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-1"
                          aria-label={t("portfolio.visit", { title: tPort(`${id}.title`) })}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary-foreground leading-relaxed">{tPort(`${id}.description`)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-(--accent-subtle) text-primary font-semibold border-primary/20 text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {tech.urlLabel && (
                      <a
                        href={tech.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-(--accent-hover) transition-colors"
                      >
                        {tech.urlLabel}
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* About + Stack */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="section-tag">{t("about.tag")}</p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("about.title")}
              </h2>
              <p className="text-secondary-foreground leading-relaxed">
                {t("about.bio1")}
              </p>
              <p className="text-secondary-foreground leading-relaxed">
                {t("about.bio2")}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat, i) => (
                  <div key={STAT_KEYS[i]} className="bg-white border border-border rounded-xl p-4 shadow-(--shadow-card)">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-0.5">{ts(STAT_KEYS[i])}</div>
                  </div>
                ))}
              </div>

              <a
                href="https://github.com/foolosophe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary-foreground hover:text-foreground transition-colors"
              >
                <Github size={18} />
                github.com/foolosophe
              </a>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground">{t("about.stackTitle")}</h3>
              {STACK_CATEGORY_KEYS.map((key) => (
                <div key={key}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {tStack(key)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STACK_TECHS[key].map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-white text-secondary-foreground border border-border text-xs px-2.5 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-secondary-foreground text-lg mb-8">
            {t("cta.description")}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2">
            <Link href="/contact">
              {t("cta.button")}
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
