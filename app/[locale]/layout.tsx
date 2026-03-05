import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "../globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { TooltipProvider } from "@/components/ui/tooltip"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const isFr = locale === "fr"
  const title = isFr
    ? "YdvSystems — Développement web, IA & SaaS sur mesure"
    : "YdvSystems — Web Development, AI & Custom SaaS"
  const description = isFr
    ? "Développeur full-stack freelance. Applications métier, intégration IA, ateliers de formation, audit maturité IA. Créateur de YDV Systems, plateforme SaaS multi-solutions secteur social."
    : "Full-stack freelance developer. Custom business applications, AI integration, corporate workshops, AI maturity audits. Creator of YDV Systems, multi-product SaaS platform for the social sector."
  const ogDescription = isFr
    ? "Logiciels SaaS pour le secteur social et la formation. Développement freelance, intégration IA, ateliers de formation."
    : "SaaS products for the social services and training sector. Freelance development, AI integration, corporate workshops."

  return {
    title,
    description,
    keywords: isFr
      ? [
          "développeur freelance",
          "Next.js",
          "TypeScript",
          "intégration IA",
          "SaaS",
          "formation IA",
          "audit IA",
          "automatisation N8N",
        ]
      : [
          "freelance developer",
          "Next.js",
          "TypeScript",
          "AI integration",
          "SaaS",
          "AI training",
          "AI audit",
          "workflow automation",
        ],
    manifest: "/manifest.json",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/icons/icon-192.png",
    },
    openGraph: {
      title,
      description: ogDescription,
      url: "https://ydvsystems.com",
      siteName: "YdvSystems",
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "YdvSystems" }],
      locale: isFr ? "fr_FR" : "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: ["/images/og-image.png"],
    },
    metadataBase: new URL("https://ydvsystems.com"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://ydvsystems.com/${locale}`,
      languages: {
        fr: "https://ydvsystems.com/fr",
        en: "https://ydvsystems.com/en",
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations("common.accessibility")

  const isFr = locale === "fr"
  const orgDescription = isFr
    ? "Développement web, IA & logiciels SaaS pour le secteur social et la formation."
    : "Web development, AI & SaaS platforms for the social services and training sector."

  return (
    <html lang={locale} className={outfit.variable}>
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_URL && (
          <script
            defer
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          />
        )}
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "YdvSystems",
              url: "https://ydvsystems.com",
              logo: "https://ydvsystems.com/images/og-image.png",
              description: orgDescription,
              founder: {
                "@type": "Person",
                name: "Yohann Dandeville",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@ydvsystems.com",
                contactType: "customer service",
                availableLanguage: ["French", "English"],
              },
              sameAs: ["https://github.com/foolosophe"],
            }),
          }}
        />
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <TooltipProvider delayDuration={200}>
            <Header />
            <div id="main-content">
              {children}
            </div>
            <Footer />
            <ScrollToTop />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
