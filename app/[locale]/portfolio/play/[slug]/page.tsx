import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { ArrowLeft, Gamepad2, Maximize } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { GAME_URLS, PORTFOLIO_TECH } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

const GAME_SLUGS: Record<string, string> = {
  dracula: "moteur-jeu",
  kart: "pills-stadium",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const portfolioId = GAME_SLUGS[slug]
  if (!portfolioId) return { title: "Not found" }

  const t = await getTranslations("portfolio.play")
  const tPort = await getTranslations("data.portfolio")
  const title = tPort(`${portfolioId}.title`)

  return {
    title: t("metaTitle", { title }),
    description: t("metaDescription", { title }),
  }
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const portfolioId = GAME_SLUGS[slug]
  if (!portfolioId) notFound()

  const gameUrl = GAME_URLS[portfolioId]
  if (!gameUrl) notFound()

  const tech = PORTFOLIO_TECH[portfolioId]
  const t = await getTranslations("portfolio")
  const tPort = await getTranslations("data.portfolio")
  const title = tPort(`${portfolioId}.title`)
  const description = tPort(`${portfolioId}.description`)

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t("play.backToPortfolio")}
        </Link>

        <div className="text-center space-y-4 mb-10">
          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0 text-xs">
            {tPort(`${portfolioId}.type`)}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-secondary-foreground max-w-xl mx-auto">{description}</p>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {tech.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-(--accent-subtle) text-primary font-semibold border-primary/20 text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-(--accent-hover) text-white font-bold text-lg transition-colors btn-glow"
          >
            <Gamepad2 size={22} />
            {t("play.launchGame")}
          </a>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Maximize size={14} />
            {t("play.fullscreen")}
          </p>
        </div>
      </div>
    </main>
  )
}
