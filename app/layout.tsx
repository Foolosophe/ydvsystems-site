import { Outfit } from "next/font/google"
import { getLocale } from "next-intl/server"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={outfit.variable} translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="antialiased notranslate">{children}</body>
    </html>
  )
}
