"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

export function CTASection() {
  const t = useTranslations("home.cta")

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateOnScroll>
          <div className="w-16 h-1 pearl-gradient animate-gradient-shift rounded-full mx-auto mb-8" style={{ backgroundSize: "200% 100%" }} />

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-secondary-foreground text-lg mb-8 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-(--accent-hover) text-foreground font-semibold px-8 gap-2 btn-glow"
            >
              <Link href="/contact">
                {t("ctaContact")}
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-secondary-foreground hover:bg-white hover:text-foreground px-8 gap-2"
            >
              <Link href="/prestations">
                {t("ctaServices")}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
