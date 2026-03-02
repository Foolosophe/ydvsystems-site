import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import { STACK, STATS } from "@/lib/data"

export function About() {
  return (
    <section id="a-propos" className="py-20 sm:py-28 bg-slate-800/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4"
          >
            À propos
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Développeur full-stack &amp; entrepreneur
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Texte */}
          <div className="space-y-6">
            <p className="text-slate-300 text-lg leading-relaxed">
              Je suis Yohann, développeur full-stack basé en France, fondateur de YdvSystems.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Je conçois des logiciels métier complets, des SaaS, des jeux et des outils IA.
              Mon approche : code propre, architecture évolutive, et zéro over-engineering.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Je travaille seul, ce qui me permet d&apos;être rapide, réactif et de livrer ce
              qui est demandé — sans réunion inutile. Preuve en chiffres :
            </p>

            {/* Chiffres */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4"
                >
                  <div className="text-2xl font-bold text-indigo-300">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Liens */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/foolosophe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Github size={18} />
                github.com/foolosophe
              </a>
            </div>
          </div>

          {/* Stack */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Stack maîtrisée</h3>
            {Object.entries(STACK).map(([category, techs]) => (
              <div key={category}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-1"
                    >
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
  )
}
