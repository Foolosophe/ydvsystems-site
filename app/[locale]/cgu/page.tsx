import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cgu.meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function CGUPage() {
  const t = await getTranslations("cgu")

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

        <p className="text-secondary-foreground mb-8">{t("lastUpdate")}</p>

        <div className="space-y-8 text-secondary-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("purpose.title")}</h2>
            <p>{t("purpose.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("access.title")}</h2>
            <p>{t("access.p1")}</p>
            <p className="mt-3">{t("access.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("usage.title")}</h2>
            <p>{t("usage.p1")}</p>
            <p className="mt-3">{t("usage.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("data.title")}</h2>
            <p>{t("data.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("availability.title")}</h2>
            <p>{t("availability.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("ip.title")}</h2>
            <p>{t("ip.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("suspension.title")}</h2>
            <p>{t("suspension.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("changes.title")}</h2>
            <p>{t("changes.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t("contact.title")}</h2>
            <p>
              {t("contact.p1")}{" "}
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
