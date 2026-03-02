import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Mentions légales — YdvSystems",
  description: "Mentions légales du site ydvsystems.com",
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mentions légales</h1>

        <div className="space-y-8 text-slate-400">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Éditeur du site</h2>
            <p>
              Le site ydvsystems.com est édité par :
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <strong className="text-slate-300">Nom :</strong> Yohann Dandeville
              </li>
              <li>
                <strong className="text-slate-300">Statut :</strong> Auto-entrepreneur
              </li>
              <li>
                <strong className="text-slate-300">Nom commercial :</strong> YdvSystems
              </li>
              <li>
                <strong className="text-slate-300">SIRET :</strong> 534 080 783 00028
              </li>
              <li>
                <strong className="text-slate-300">Email :</strong>{" "}
                <a
                  href="mailto:contact@ydvsystems.com"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  contact@ydvsystems.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Hébergement</h2>
            <p>
              Ce site est hébergé par :
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <strong className="text-slate-300">Hébergeur :</strong> Hetzner Online GmbH
              </li>
              <li>
                <strong className="text-slate-300">Adresse :</strong> Industriestr. 25, 91710 Gunzenhausen, Allemagne
              </li>
              <li>
                <strong className="text-slate-300">Site :</strong>{" "}
                <a
                  href="https://www.hetzner.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  hetzner.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Données personnelles
            </h2>
            <p>
              Ce site ne collecte pas de données personnelles à des fins commerciales.
              Le formulaire de contact transmet uniquement les informations saisies
              (nom, email, message) à l&apos;adresse email de l&apos;éditeur via le service
              Resend pour permettre une réponse à votre demande.
            </p>
            <p className="mt-3">
              Aucun cookie analytique ou de tracking n&apos;est utilisé sur ce site.
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification
              et de suppression de vos données en contactant{" "}
              <a
                href="mailto:contact@ydvsystems.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                contact@ydvsystems.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, code, design) est la propriété
              exclusive de YdvSystems — Yohann Dandeville, sauf mention contraire.
              Toute reproduction est interdite sans autorisation préalable.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
