"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { STACK_CATEGORY_KEYS, STACK_TECHS } from "@/lib/data"

/** Convert tech display name to i18n-safe key (no dots or slashes) */
function toKey(tech: string) {
  return tech.replace(/\./g, "").replace(/\//g, "-")
}

export function TechStack() {
  const tStack = useTranslations("data.stack")

  return (
    <div className="space-y-5">
      {STACK_CATEGORY_KEYS.map((key) => (
        <div key={key}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {tStack(key)}
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK_TECHS[key].map((tech) => (
              <Tooltip key={tech}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="bg-white text-secondary-foreground border border-border text-xs px-2.5 py-1 cursor-default"
                  >
                    {tech}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[220px] text-center"
                >
                  {tStack(`tooltips.${toKey(tech)}`)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
