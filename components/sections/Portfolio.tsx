import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { PORTFOLIO } from "@/lib/data"

export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4"
          >
            Portfolio
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Projets réalisés
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Des projets concrets, en production ou déployés — pas des démos.
          </p>
        </div>

        {/* Grille projets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PORTFOLIO.map((project) => (
            <Card
              key={project.id}
              className="bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700/60 text-slate-400 border-0 text-xs mb-2"
                    >
                      {project.type}
                    </Badge>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0 mt-1"
                      aria-label={`Visiter ${project.title}`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {project.urlLabel && (
                  <a
                    href={project.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {project.urlLabel}
                    <ExternalLink size={12} />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
