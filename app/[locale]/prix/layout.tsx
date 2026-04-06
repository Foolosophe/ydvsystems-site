import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getPageAlternates } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pricing.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "prix"),
  }
}

export default function PrixLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
