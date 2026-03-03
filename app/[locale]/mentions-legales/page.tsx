import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function MentionsLegalesPage() {
  const t = await getTranslations("legal")

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

        <div className="space-y-8 text-secondary-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("editor.title")}</h2>
            <p>{t("editor.intro")}</p>
            <ul className="mt-2 space-y-1">
              <li>
                <strong className="text-(--text-tertiary)">{t("editor.name")}</strong> {t("editor.nameValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("editor.status")}</strong> {t("editor.statusValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("editor.tradeName")}</strong> {t("editor.tradeNameValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("editor.siret")}</strong> {t("editor.siretValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("editor.email")}</strong>{" "}
                <a
                  href="mailto:contact@ydvsystems.com"
                  className="text-primary hover:text-(--accent-hover) transition-colors"
                >
                  contact@ydvsystems.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("hosting.title")}</h2>
            <p>{t("hosting.intro")}</p>
            <ul className="mt-2 space-y-1">
              <li>
                <strong className="text-(--text-tertiary)">{t("hosting.host")}</strong> {t("hosting.hostValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("hosting.address")}</strong> {t("hosting.addressValue")}
              </li>
              <li>
                <strong className="text-(--text-tertiary)">{t("hosting.website")}</strong>{" "}
                <a
                  href="https://www.hetzner.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-(--accent-hover) transition-colors"
                >
                  hetzner.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              {t("privacy.title")}
            </h2>
            <p>{t("privacy.paragraph1")}</p>
            <p className="mt-3">
              {t("privacy.paragraph2")}{" "}
              <a
                href="mailto:contact@ydvsystems.com"
                className="text-primary hover:text-(--accent-hover) transition-colors"
              >
                contact@ydvsystems.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              {t("intellectual.title")}
            </h2>
            <p>{t("intellectual.content")}</p>
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
