"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Github, Linkedin } from "lucide-react"
import { SOLUTIONS } from "@/lib/data"

export function Footer() {
  const t = useTranslations("common.footer")
  const pathname = usePathname()

  const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/"
  const solutionMatch = pathWithoutLocale.match(/^\/solutions\/([a-z-]+)/)
  const activeSolutionColor = solutionMatch
    ? SOLUTIONS.find((s) => s.slug === solutionMatch[1])?.color ?? null
    : null

  const FOOTER_SECTIONS = {
    [t("prestations")]: [
      { label: t("customDev"), href: "/prestations" as const },
      { label: t("iaIntegration"), href: "/prestations" as const },
      { label: t("workshops"), href: "/prestations" as const },
      { label: t("iaAudit"), href: "/prestations" as const },
    ],
    [t("solutions")]: [
      { label: "YDV Insertion", href: "/solutions/insertion" as const },
      { label: "YDV Formation", href: "/solutions/formation" as const },
      { label: "YDV Coaching", href: "/solutions/coaching" as const },
      { label: "YDV Manager", href: "/solutions/manager" as const },
    ],
    [t("ressources")]: [
      { label: t("pricing"), href: "/prix" as const },
      { label: t("blog"), href: "/blog" as const },
      { label: t("portfolio"), href: "/portfolio" as const },
      { label: t("contact"), href: "/contact" as const },
      { label: t("legal"), href: "/mentions-legales" as const },
    ],
  }

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-foreground">
              Ydv<span
                style={activeSolutionColor ? { color: activeSolutionColor } : undefined}
                className={activeSolutionColor ? undefined : "text-primary"}
              >Systems</span>
            </Link>
            <p className="text-sm font-medium text-muted-foreground mt-3 leading-relaxed">
              {t("description")}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://github.com/foolosophe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/yohann-dandeville/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_SECTIONS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("siret")}
          </p>
        </div>
      </div>
    </footer>
  )
}
