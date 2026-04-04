"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

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
  children: React.ReactNode
}

export function PopupCard({ popup, children }: PopupCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="h-full cursor-default">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-[440px] p-0 overflow-hidden"
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
            <a
              href={popup.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-(--accent-hover) transition-colors pt-1"
            >
              {popup.urlLabel}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
