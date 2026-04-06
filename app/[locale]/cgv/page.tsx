import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { getPageAlternates } from "@/lib/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("cgv.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "cgv"),
  }
}

export default async function CGVPage() {
  const t = await getTranslations("cgv")

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

        <p className="text-secondary-foreground mb-8">{t("lastUpdate")}</p>

        <div className="space-y-8 text-secondary-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("scope.title")}</h2>
            <p>{t("scope.p1")}</p>
            <p className="mt-3">{t("scope.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("saas.title")}</h2>
            <p>{t("saas.p1")}</p>
            <p className="mt-3">{t("saas.p2")}</p>
            <p className="mt-3">{t("saas.p3")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("freelance.title")}</h2>
            <p>{t("freelance.p1")}</p>
            <p className="mt-3">{t("freelance.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("pricing.title")}</h2>
            <p>{t("pricing.p1")}</p>
            <p className="mt-3">{t("pricing.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("trial.title")}</h2>
            <p>{t("trial.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("duration.title")}</h2>
            <p>{t("duration.p1")}</p>
            <p className="mt-3">{t("duration.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("ip.title")}</h2>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("ip.saasTitle")}</h3>
            <p>{t("ip.saasContent")}</p>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("ip.freelanceTitle")}</h3>
            <p>{t("ip.freelanceContent")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("liability.title")}</h2>
            <p>{t("liability.p1")}</p>
            <p className="mt-3">{t("liability.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("force.title")}</h2>
            <p>{t("force.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("law.title")}</h2>
            <p>{t("law.p1")}</p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:text-(--accent-hover) transition-colors"
          >
            &larr; {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  )
}
