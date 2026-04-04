# CLAUDE.md — ydvsystems-site

## Stack
- **Framework** : Next.js App Router, React 19, TypeScript strict
- **Style** : Tailwind CSS 4 — palette : BG `#060608`, Cyan `#00bcd4`, White `#f0f2f5`
- **Font** : Outfit (`--font-outfit`)
- **Animations** : GSAP core free uniquement (pas SplitText ni MorphSVG — payants)
- **i18n** : next-intl — fichiers `messages/fr.json` et `messages/en.json`
- **Package manager** : pnpm

## Règles de travail

- **Toujours explorer avant de coder** — lire les fichiers concernés avant toute modification
- **Proposer les changements et attendre validation** avant d'écrire la moindre ligne de code
- **Ne pas utiliser l'outil Agent** — utiliser Glob, Grep, Read directement
- **Ne modifier que ce qui est demandé** — pas de refactoring, pas de commentaires, pas d'améliorations non sollicitées
- **Ne pas toucher aux styles** sauf demande explicite

## Pipeline obligatoire après chaque modification

```bash
pnpm build
```

Pas de script `typecheck` ni `lint` dans ce projet — `pnpm build` suffit.

## Déploiement

**Ne jamais déployer sans validation explicite de l'utilisateur.**

Une fois la validation reçue :
```bash
ssh root@46.225.71.188 "cd /var/www/ydvsystems-site && git pull origin master && npm install && npm run build && pm2 restart ydvsystems-site"
```

**Ne jamais oublier `npm install`** (le serveur tourne sous npm, pas pnpm).
Vérifier que PM2 affiche `status: online` après le restart.

## Architecture i18n

Tous les textes passent par **next-intl** — pas de hardcoding dans les composants.
- Toute nouvelle clé doit être ajoutée dans **fr.json ET en.json**
- Les clés manquantes en production provoquent des erreurs 500 (next-intl throw au runtime côté serveur)
- Tester systématiquement `/en/` après toute modification de traductions

## Structure des pages

| Route | Fichier |
|---|---|
| `/fr` | `app/[locale]/page.tsx` |
| `/fr/a-propos` | `app/[locale]/a-propos/page.tsx` |
| `/fr/prestations` | `app/[locale]/prestations/page.tsx` |
| `/fr/solutions` | `app/[locale]/solutions/page.tsx` |
| `/fr/prix` | `app/[locale]/prix/page.tsx` |
| `/fr/portfolio` | `app/[locale]/portfolio/page.tsx` |
| `/fr/blog` | `app/[locale]/blog/page.tsx` |
| `/fr/contact` | `app/[locale]/contact/page.tsx` |

## Composants clés

- `components/sections/HeroDual.tsx` — hero homepage
- `components/sections/PortfolioPreview.tsx` — preview portfolio homepage
- `components/sections/CTASection.tsx` — CTA bas de homepage
- `components/Header.tsx` — navigation
- `components/Footer.tsx` — pied de page

## Données centralisées

- `lib/data.ts` — `SERVICE_IDS`, `SERVICE_ICONS`, `SERVICE_TECH_TAGS`, `PORTFOLIO_IDS`, `PORTFOLIO_PREVIEW_IDS`, `STATS`
- `messages/fr.json` / `messages/en.json` — tout le contenu texte

## Serveur

- **Hébergeur** : Hetzner Cloud — IP `46.225.71.188`
- **PM2** : process `ydvsystems-site` port `3001`
- **Dossier** : `/var/www/ydvsystems-site`
- Autres apps sur le même serveur : `ydv-platform` (3000), `blog-parkinson` (3002)
