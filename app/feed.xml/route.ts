import { prisma } from "@/lib/db"

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      publishedAt: true,
    },
  })

  const siteUrl = "https://ydvsystems.com"

  const items = articles
    .map(
      (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/fr/blog/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/fr/blog/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <category>${a.category}</category>
      ${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ""}
    </item>`
    )
    .join("\n")

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>YdvSystems Blog</title>
    <link>${siteUrl}/fr/blog</link>
    <description>Articles sur le developpement web, l'IA, le secteur social et la gestion d'organismes de formation.</description>
    <language>fr</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
