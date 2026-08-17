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
  const t = await getTranslations("privacy.meta")
  return {
    title: t("title"),
    description: t("description"),
    alternates: getPageAlternates(locale, "confidentialite"),
  }
}

export default async function ConfidentialitePage() {
  const t = await getTranslations("privacy")

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

        <p className="text-secondary-foreground mb-8">{t("lastUpdate")}</p>

        <div className="space-y-8 text-secondary-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("controller.title")}</h2>
            <p>{t("controller.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("collected.title")}</h2>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("collected.contactTitle")}</h3>
            <p>{t("collected.contactContent")}</p>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("collected.saasTitle")}</h3>
            <p>{t("collected.saasContent")}</p>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("collected.analyticsTitle")}</h3>
            <p>{t("collected.analyticsContent")}</p>
            {/* Information au sens de l'article 14 du RGPD, pour les donnees
                collectees indirectement dans le cadre de la prospection de
                proximite. C'est le canal qui vaut pour toute personne
                demarchee, avec ou sans document laisse sur place. */}
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">{t("collected.prospectionTitle")}</h3>
            <p className="whitespace-pre-line">{t("collected.prospectionContent")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("purposes.title")}</h2>
            <p>{t("purposes.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("basis.title")}</h2>
            <p>{t("basis.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("retention.title")}</h2>
            <p>{t("retention.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("subprocessors.title")}</h2>
            <p>{t("subprocessors.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("transfers.title")}</h2>
            <p>{t("transfers.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("rights.title")}</h2>
            <p>{t("rights.p1")}</p>
            <p className="mt-3">
              {t("rights.p2")}{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-(--accent-hover) transition-colors"
              >
                contact@ydvsystems.com
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("cookies.title")}</h2>
            <p>{t("cookies.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("security.title")}</h2>
            <p>{t("security.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("modifications.title")}</h2>
            <p>{t("modifications.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("dpo.title")}</h2>
            <p>
              {t("dpo.p1")}{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-(--accent-hover) transition-colors"
              >
                contact@ydvsystems.com
              </Link>.
            </p>
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
