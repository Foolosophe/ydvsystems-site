import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"
import { STATS, STACK_BADGES } from "@/lib/data"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Fond décoratif */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge accroche */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm text-indigo-300 font-medium">
            Disponible pour nouvelles missions
          </span>
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Développement web,{" "}
          <span className="text-indigo-400">IA</span>{" "}
          &amp;{" "}
          <span className="text-violet-400">SaaS</span>{" "}
          sur mesure
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Je conçois des logiciels métier complexes, intègre l&apos;IA dans vos outils
          existants et propose des formations pratiques pour vos équipes.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            asChild
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 gap-2"
          >
            <a href="#services">
              Voir mes services
              <ArrowRight size={18} />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 gap-2"
          >
            <a
              href="https://insertion.ydvsystems.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Découvrir YDV Systems
              <ExternalLink size={16} />
            </a>
          </Button>
        </div>

        {/* Badges stack */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {STACK_BADGES.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/50 transition-colors px-3 py-1 text-sm"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Chiffres clés */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
