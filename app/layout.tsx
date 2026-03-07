import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={outfit.variable} translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="antialiased notranslate">{children}</body>
    </html>
  )
}
