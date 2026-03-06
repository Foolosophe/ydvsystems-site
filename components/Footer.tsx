"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Linkedin } from "lucide-react"
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
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/in/yohann-dandeville-a6203b257"
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
