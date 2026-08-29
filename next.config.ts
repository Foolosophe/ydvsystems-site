import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import withSerwistInit from "@serwist/next"
import withBundleAnalyzer from "@next/bundle-analyzer"

const withNextIntl = createNextIntlPlugin()

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // Les fichiers de public/ sont ajoutes au precache SANS passer par la limite de
  // taille (maximumFileSizeToCacheInBytes ne filtre que les assets webpack).
  // On exclut donc explicitement public/motion-design/, qui contient le film Plume
  // (7,5 Mo) : il doit rester en chargement paresseux dans son iframe.
  globPublicPatterns: ["*", "!(motion-design)/**/*"],
})

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  async rewrites() {
    const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL
    if (!umamiUrl) return []
    return [
      {
        source: "/a/x.js",
        destination: `${umamiUrl}/script.js`,
      },
      {
        source: "/a/api/send",
        destination: `${umamiUrl}/api/send`,
      },
    ]
  },
  async redirects() {
    return [
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ]
  },
}

export default withAnalyzer(withSerwist(withNextIntl(nextConfig)))
