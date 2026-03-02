import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "YdvSystems — Développement web, IA & SaaS sur mesure",
  description:
    "Développeur full-stack freelance. Applications métier, intégration IA, ateliers de formation, audit maturité IA. Créateur de YDV Systems, plateforme SaaS multi-solutions secteur social.",
  keywords: [
    "développeur freelance",
    "Next.js",
    "TypeScript",
    "intégration IA",
    "SaaS",
    "formation IA",
    "audit IA",
    "automatisation N8N",
  ],
  openGraph: {
    title: "YdvSystems — Développement web, IA & SaaS",
    description:
      "Applications métier, IA, formation. Créateur de YDV Systems.",
    url: "https://ydvsystems.com",
    siteName: "YdvSystems",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
  },
  metadataBase: new URL("https://ydvsystems.com"),
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
