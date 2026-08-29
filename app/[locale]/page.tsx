import type { Metadata } from "next"
import { HeroDual } from "@/components/sections/HeroDual"
import { SolutionsGrid } from "@/components/sections/SolutionsGrid"
import { FreelancePreview } from "@/components/sections/FreelancePreview"
import { VitrinePreview } from "@/components/sections/VitrinePreview"
import { MotionDesignPreview } from "@/components/sections/MotionDesignPreview"
import { PortfolioPreview } from "@/components/sections/PortfolioPreview"
import { CTASection } from "@/components/sections/CTASection"
import { getPageAlternates } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return { alternates: getPageAlternates(locale) }
}

export default function HomePage() {
  return (
    <main>
      <HeroDual />
      <FreelancePreview />
      <VitrinePreview />
      <MotionDesignPreview />
      <SolutionsGrid />
      <PortfolioPreview />
      <CTASection />
    </main>
  )
}
