"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname as useI18nPathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"

const LOCALE_CONFIG: Record<string, { flag: React.ReactNode; label: string }> = {
  fr: {
    label: "Français",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-[2px] shrink-0">
        <rect width="7" height="14" fill="#002395" />
        <rect x="7" width="6" height="14" fill="#fff" />
        <rect x="13" width="7" height="14" fill="#ED2939" />
      </svg>
    ),
  },
  en: {
    label: "English",
    flag: (
      <svg width="20" height="14" viewBox="0 0 60 42" className="rounded-[2px] shrink-0">
        <rect width="60" height="42" fill="#012169" />
        <path d="M0 0L60 42M60 0L0 42" stroke="#fff" strokeWidth="7" />
        <path d="M0 0L60 42M60 0L0 42" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0V42M0 21H60" stroke="#fff" strokeWidth="11" />
        <path d="M30 0V42M0 21H60" stroke="#C8102E" strokeWidth="7" />
      </svg>
    ),
  },
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const i18nPathname = useI18nPathname()
  const locale = useLocale()
  const t = useTranslations("common")

  const NAV_LINKS = [
    { label: t("nav.prestations"), href: "/prestations" as const },
    { label: t("nav.solutions"), href: "/solutions" as const },
    { label: t("nav.pricing"), href: "/prix" as const },
    { label: t("nav.blog"), href: "/blog" as const },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setLangOpen(false)
  }, [pathname])

  // Close language dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [langOpen])

  const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/"
  const currentConfig = LOCALE_CONFIG[locale] || LOCALE_CONFIG.fr
  const locales = ["fr", "en"] as const

  return (
    <>
      {/* Pearl gradient bar */}
      <div
        className="fixed top-0 left-0 right-0 z-60 h-[1.5px] pearl-gradient animate-gradient-shift"
        style={{ backgroundSize: "200% 100%" }}
      />

      <header
        className={`fixed top-[1.5px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-border shadow-(--shadow-sm)"
            : "bg-white/60 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold text-foreground">
                Ydv<span className="text-primary">Systems</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = link.href.split("/")[1] === pathWithoutLocale.split("/")[1]
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm transition-colors py-1 ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-(--text-tertiary) hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {/* Language selector dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary"
                  aria-expanded={langOpen}
                  aria-haspopup="listbox"
                >
                  {currentConfig.flag}
                  <span>{currentConfig.label}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>

                <div
                  className={`absolute right-0 top-full mt-1.5 bg-white border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top-right ${
                    langOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  role="listbox"
                  aria-label="Language"
                >
                  {locales.map((loc) => {
                    const config = LOCALE_CONFIG[loc]
                    const isActive = loc === locale
                    return (
                      <Link
                        key={loc}
                        href={i18nPathname}
                        locale={loc}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => setLangOpen(false)}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        {config.flag}
                        <span>{config.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <Button asChild size="sm" className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold">
                <Link href="/contact">{t("nav.contact")}</Link>
              </Button>
            </div>

            <button
              className="md:hidden text-(--text-tertiary) hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t("accessibility.closeMenu") : t("accessibility.openMenu")}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-border py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-sm py-1 transition-colors ${
                    link.href.split("/")[1] === pathWithoutLocale.split("/")[1]
                      ? "text-foreground font-medium"
                      : "text-(--text-tertiary) hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile language selector */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {locales.map((loc) => {
                  const config = LOCALE_CONFIG[loc]
                  const isActive = loc === locale
                  return (
                    <Link
                      key={loc}
                      href={i18nPathname}
                      locale={loc}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-lg border transition-colors ${
                        isActive
                          ? "border-primary/30 bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      }`}
                    >
                      {config.flag}
                      <span>{config.label}</span>
                    </Link>
                  )
                })}
              </div>

              <Button asChild size="sm" className="w-full bg-primary hover:bg-(--accent-hover) text-foreground font-semibold">
                <Link href="/contact">{t("nav.contact")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
