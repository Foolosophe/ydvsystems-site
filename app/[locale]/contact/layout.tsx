import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getPageAlternates } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("contact.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "contact"),
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
