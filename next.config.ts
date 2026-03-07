import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import withSerwistInit from "@serwist/next"
import withBundleAnalyzer from "@next/bundle-analyzer"

const withNextIntl = createNextIntlPlugin()

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
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
        source: "/stats/script.js",
        destination: `${umamiUrl}/script.js`,
      },
      {
        source: "/api/send",
        destination: `${umamiUrl}/api/send`,
      },
    ]
  },
}

export default withAnalyzer(withSerwist(withNextIntl(nextConfig)))
