"use client"

import Image from "next/image"
import { ArrowRight, ExternalLink, ListTree } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Link } from "@/i18n/navigation"
import { internalPath } from "@/lib/links"

interface PopupFeature {
  title: string
  description: string
}

interface PopupData {
  url: string | null
  urlLabel: string | null
  image: string
  features: PopupFeature[]
}

interface PopupCardProps {
  popup: PopupData
  label: string
}

// Ouverture au clic, et non au survol : le survol laissait ce contenu
// totalement hors d'atteinte sur mobile et sur tablette, et rien n'indiquait
// qu'il existait.
export function PopupCard({ popup, label }: PopupCardProps) {
  // Meme regle que sur les cartes : un lien vers le site ne s'ouvre pas
  // dans un nouvel onglet, sans quoi l'ecran de chargement rejoue.
  const interne = internalPath(popup.url)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-(--accent-hover) transition-colors cursor-pointer"
        >
          <ListTree size={13} />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-[min(440px,calc(100vw-2rem))] p-0 overflow-hidden"
        sideOffset={12}
      >
        <div className="relative w-full h-44 bg-secondary shrink-0">
          <Image
            src={popup.image}
            alt=""
            fill
            className="object-cover object-top"
            sizes="440px"
          />
        </div>
        <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto">
          <ul className="space-y-2.5">
            {popup.features.map((f, i) => (
              <li key={i} className="text-xs leading-relaxed">
                <span className="font-semibold text-foreground">{f.title}</span>
                <span className="text-muted-foreground"> — {f.description}</span>
              </li>
            ))}
          </ul>
          {popup.url && popup.urlLabel && (
            interne ? (
              <Link
                href={interne}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-(--accent-hover) transition-colors pt-1"
              >
                {popup.urlLabel}
                <ArrowRight size={12} />
              </Link>
            ) : (
              <a
                href={popup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-(--accent-hover) transition-colors pt-1"
              >
                {popup.urlLabel}
                <ExternalLink size={12} />
              </a>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
