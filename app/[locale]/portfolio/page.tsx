import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowRight, ExternalLink, Gamepad2 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"
import { PORTFOLIO_IDS, PORTFOLIO_TECH, GAME_URLS } from "@/lib/data"
import { StatsGrid } from "@/components/StatsGrid"
import { TechStack } from "@/components/TechStack"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio")
  const tPort = await getTranslations("data.portfolio")

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="section-tag">{t("hero.tag")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              <span className="text-primary" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.15), -0.5px -0.5px 0 rgba(0,0,0,0.08)" }}>Y</span>ohann{" "}
              <span className="text-primary" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.15), -0.5px -0.5px 0 rgba(0,0,0,0.08)" }}>D</span>ande<span className="text-primary" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.15), -0.5px -0.5px 0 rgba(0,0,0,0.08)" }}>v</span>ille
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <AnimateOnScroll>
              <div className="space-y-6">
                <p className="section-tag">{t("about.tag")}</p>
                <div className="flex items-center gap-5 mb-2">
                  <Image
                    src="/images/yohann.jpg"
                    alt={t("about.photoAlt")}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-primary/20 shadow-md"
                  />
                  <h2 className="text-3xl font-bold text-foreground">
                    {t("about.title")}
                  </h2>
                </div>
                <p className="text-secondary-foreground leading-relaxed">
                  {t("about.bio1")}
                </p>
                <p className="text-secondary-foreground leading-relaxed">
                  {t("about.bio2")}
                </p>

                <StatsGrid />

                <a
                  href="https://github.com/foolosophe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-secondary-foreground hover:text-foreground transition-colors"
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  github.com/foolosophe
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-5">{t("about.stackTitle")}</h3>
                <TechStack />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="section-tag">{t("projectsTag")}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PORTFOLIO_IDS.map((id, i) => {
              const tech = PORTFOLIO_TECH[id]
              return (
                <AnimateOnScroll key={id} delay={i * 100}>
                  <Card className="bg-white border-border overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-(--shadow-card-hover) card-tilt group h-full">
                    <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs mb-2">
                            {tPort(`${id}.type`)}
                          </Badge>
                          <h2 className="text-lg font-bold text-foreground">{tPort(`${id}.title`)}</h2>
                        </div>
                        {tech.url && (
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-1"
                            aria-label={t("visit", { title: tPort(`${id}.title`) })}
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
                      <div className="flex flex-wrap items-center gap-3">
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
                        {GAME_URLS[id] && (
                          <a
                            href={GAME_URLS[id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-(--accent-hover) px-3 py-1.5 rounded-md transition-colors"
                          >
                            <Gamepad2 size={14} />
                            {t("playOnline")}
                          </a>
                        )}
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
      <section className="py-16 bg-secondary">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
            <p className="text-secondary-foreground mb-6">{t("cta.description")}</p>
            <Button asChild className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 btn-glow">
              <Link href="/contact">
                {t("cta.button")}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
