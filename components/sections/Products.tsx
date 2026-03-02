import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Clock, ExternalLink, ArrowRight } from "lucide-react"
import { YDV_SOLUTIONS } from "@/lib/data"

export function Products() {
  return (
    <section id="produits" className="py-20 sm:py-28 bg-slate-800/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="bg-violet-500/10 text-violet-300 border-violet-500/20 mb-4"
          >
            Produits SaaS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mes produits en production
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Des logiciels que j&apos;ai conçus et que je déploie — avec abonnement mensuel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* YDV Systems */}
          <Card className="bg-slate-800/60 border-slate-700/50 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-2">
                    Produit phare
                  </Badge>
                  <h3 className="text-xl font-bold text-white">YDV Systems</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Plateforme SaaS multi-solutions pour le secteur social
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                La plateforme de gestion complète pour les structures d&apos;accompagnement
                social, professionnel et de formation. 9 solutions sur un seul abonnement.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Solutions grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {YDV_SOLUTIONS.map((sol) => (
                  <div
                    key={sol.name}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg ${sol.bg} border border-white/5`}
                  >
                    {sol.status === "prod" ? (
                      <CheckCircle2 size={15} className={`${sol.color} shrink-0`} />
                    ) : (
                      <Clock size={15} className="text-slate-600 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className={`text-xs font-medium ${sol.status === "prod" ? sol.color : "text-slate-400"}`}>
                        {sol.name}
                        {sol.status === "prod" && (
                          <span className="ml-1.5 text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full">
                            EN PROD
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{sol.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="bg-slate-700/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-white">15 €</span>
                  <span className="text-slate-400 text-sm">/user/mois</span>
                </div>
                <p className="text-xs text-slate-500">
                  Plancher 49 €/mois · Essai 1 mois gratuit, sans CB
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
              >
                <a href="#contact">
                  Demander une démo
                  <ArrowRight size={16} />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Le Prompt Parfait */}
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardHeader className="pb-4">
              <div className="mb-3">
                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 mb-2">
                  En production
                </Badge>
                <h3 className="text-xl font-bold text-white">Le Prompt Parfait</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Générateur de prompts IA professionnel
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                66+ templates de prompts professionnels pour l&apos;IA générative.
                Disponible sur Web, Desktop (Windows/Mac/Linux) et Android.
                8 langues supportées. Version 3.2.2 en production.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "66+", sub: "templates" },
                  { label: "8", sub: "langues" },
                  { label: "4", sub: "plateformes" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center bg-slate-700/30 rounded-lg p-3"
                  >
                    <div className="text-xl font-bold text-violet-300">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {["Web (PWA)", "Electron Desktop", "Android"].map((p) => (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="bg-slate-700/50 text-slate-400 border-0 text-xs"
                  >
                    {p}
                  </Badge>
                ))}
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white gap-2"
              >
                <a
                  href="https://lepromptparfait.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Découvrir
                  <ExternalLink size={15} />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
