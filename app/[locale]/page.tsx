import { HeroDual } from "@/components/sections/HeroDual"
import { SolutionsGrid } from "@/components/sections/SolutionsGrid"
import { FreelancePreview } from "@/components/sections/FreelancePreview"
import { PortfolioPreview } from "@/components/sections/PortfolioPreview"
import { CTASection } from "@/components/sections/CTASection"

export default function HomePage() {
  return (
    <main>
      <HeroDual />
      <FreelancePreview />
      <SolutionsGrid />
      <PortfolioPreview />
      <CTASection />
    </main>
  )
}
