import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

const FOOTER_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Produits", href: "#produits" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
  { label: "Mentions légales", href: "/mentions-legales" },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            Ydv<span className="text-indigo-400">Systems</span>
          </Link>

          <p className="text-sm text-slate-500 text-center">
            Développement web, IA &amp; SaaS sur mesure
          </p>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/foolosophe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} YdvSystems — Yohann · Auto-entrepreneur
          </p>
        </div>
      </div>
    </footer>
  )
}
