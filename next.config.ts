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

const nextConfig: NextConfig = {}

export default withAnalyzer(withSerwist(withNextIntl(nextConfig)))
