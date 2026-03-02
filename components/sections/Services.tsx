import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Code2,
  Brain,
  GraduationCap,
  ClipboardCheck,
  Workflow,
  MonitorSmartphone,
  Gamepad2,
  Heart,
} from "lucide-react"
import { SERVICES } from "@/lib/data"

const ICONS: Record<string, React.ReactNode> = {
  Code2: <Code2 size={24} />,
  Brain: <Brain size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />,
  Workflow: <Workflow size={24} />,
  MonitorSmartphone: <MonitorSmartphone size={24} />,
  Gamepad2: <Gamepad2 size={24} />,
  Heart: <Heart size={24} />,
}

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4"
          >
            Services freelance
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ce que je peux faire pour vous
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Missions ponctuelles ou projets longs — du développement sur mesure
            à la formation IA, tout secteur.
          </p>
        </div>

        {/* Grille 8 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => (
            <Card
              key={service.id}
              className="bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 group"
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                  {ICONS[service.icon]}
                </div>
                <h3 className="font-semibold text-white text-base leading-snug">
                  {service.title}
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-slate-700/50 text-slate-400 border-0 text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-sm font-medium text-indigo-300">
                    {service.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA bas de section */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Un besoin spécifique ?{" "}
            <a
              href="#contact"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              Décrivez votre projet
            </a>{" "}
            — je réponds sous 24h.
          </p>
        </div>
      </div>
    </section>
  )
}
