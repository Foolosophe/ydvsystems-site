import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Products } from "@/components/sections/Products"
import { Portfolio } from "@/components/sections/Portfolio"
import { About } from "@/components/sections/About"
import { Contact } from "@/components/sections/Contact"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Products />
      <Portfolio />
      <About />
      <Contact />
    </main>
  )
}
