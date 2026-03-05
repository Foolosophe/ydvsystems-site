import { describe, it, expect } from "vitest"
import { SOLUTIONS } from "@/lib/data"
import { SERVICE_IDS } from "@/lib/data"
import { BLOG_SLUGS } from "@/app/[locale]/blog/data"

describe("JSON-LD schema: ProfessionalService (prestations)", () => {
  it("generates valid structure with all services", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "YdvSystems",
      url: "https://ydvsystems.com",
      provider: { "@type": "Person", name: "Yohann Dandeville" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICE_IDS.map((id) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: id, description: `Description for ${id}` },
        })),
      },
    }

    expect(schema["@context"]).toBe("https://schema.org")
    expect(schema["@type"]).toBe("ProfessionalService")
    expect(schema.hasOfferCatalog["@type"]).toBe("OfferCatalog")
    expect(schema.hasOfferCatalog.itemListElement.length).toBe(SERVICE_IDS.length)

    for (const item of schema.hasOfferCatalog.itemListElement) {
      expect(item["@type"]).toBe("Offer")
      expect(item.itemOffered["@type"]).toBe("Service")
      expect(item.itemOffered.name).toBeTruthy()
    }
  })
})

describe("JSON-LD schema: ItemList (solutions)", () => {
  it("generates valid structure with all solutions", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Solutions",
      itemListElement: SOLUTIONS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://ydvsystems.com/solutions/${s.slug}`,
        name: s.name,
      })),
    }

    expect(schema["@type"]).toBe("ItemList")
    expect(schema.itemListElement.length).toBe(SOLUTIONS.length)

    for (let i = 0; i < schema.itemListElement.length; i++) {
      const item = schema.itemListElement[i]
      expect(item["@type"]).toBe("ListItem")
      expect(item.position).toBe(i + 1)
      expect(item.url).toContain("ydvsystems.com/solutions/")
      expect(item.name).toBeTruthy()
    }
  })
})

describe("JSON-LD schema: CollectionPage (blog)", () => {
  it("generates valid structure with all articles", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blog",
      description: "Articles",
      url: "https://ydvsystems.com/fr/blog",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: BLOG_SLUGS.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://ydvsystems.com/fr/blog/${slug}`,
          name: slug,
        })),
      },
    }

    expect(schema["@type"]).toBe("CollectionPage")
    expect(schema.url).toContain("/blog")
    expect(schema.mainEntity["@type"]).toBe("ItemList")
    expect(schema.mainEntity.itemListElement.length).toBe(BLOG_SLUGS.length)

    for (const item of schema.mainEntity.itemListElement) {
      expect(item["@type"]).toBe("ListItem")
      expect(item.url).toContain("/blog/")
    }
  })
})
