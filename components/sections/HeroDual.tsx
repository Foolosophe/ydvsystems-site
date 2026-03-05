import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowDown } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CountUp } from "@/components/CountUp"
import { STATS } from "@/lib/data"

const STAT_KEYS = ["projects", "tests", "sectors", "platforms"] as const

// Parse stat values for CountUp: "10+" → { num: 10, suffix: "+" }, "4 253" → { num: 4253, suffix: "" }
function parseStat(value: string) {
  const clean = value.replace(/\s/g, "")
  const match = clean.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: value }
  return { num: parseInt(match[1], 10), suffix: match[2] }
}

export function HeroDual() {
  const t = useTranslations("home.hero")
  const ts = useTranslations("home.stats")

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-24">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full blur-3xl opacity-60 animate-float"
          style={{ background: "rgba(0, 188, 212, 0.04)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full blur-3xl opacity-40 animate-float delay-3"
          style={{ background: "linear-gradient(135deg, var(--pearl-mid), var(--pearl-end))" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <p className="section-tag animate-fade-in-up">{t("tag")}</p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight animate-fade-in-up delay-1">
          {t("title1")}<span className="text-gradient">{t("titleHighlight1")}</span>
          <br className="hidden sm:block" />
          {t("title2")}<span className="text-gradient">{t("titleHighlight2")}</span>
        </h1>

        <p className="text-lg sm:text-xl text-secondary-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-2">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up delay-3">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 shadow-(--shadow-glow) hover:shadow-none transition-all"
          >
            <Link href="/prestations">
              {t("ctaFreelance")}
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border text-secondary-foreground hover:bg-secondary hover:text-foreground px-8 gap-2"
          >
            <a href="#solutions">
              {t("ctaSolutions")}
              <ArrowRight size={18} />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto animate-fade-in-up delay-4">
          {STATS.map((stat, i) => (
            <div
              key={STAT_KEYS[i]}
              className="bg-white border border-border rounded-xl p-4 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                <CountUp end={parseStat(stat.value).num} suffix={parseStat(stat.value).suffix} />
              </div>
              <div className="text-sm font-medium text-muted-foreground">{ts(STAT_KEYS[i])}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 animate-fade-in-up delay-5">
          <a href="#solutions" className="inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-xs">{t("scrollHint")}</span>
            <ArrowDown size={16} className="animate-scroll-hint" />
          </a>
        </div>
      </div>
    </section>
  )
}
