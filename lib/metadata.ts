const BASE_URL = "https://ydvsystems.com"

export function getPageAlternates(locale: string, path: string = "") {
  const p = path ? `/${path}` : ""
  return {
    canonical: `${BASE_URL}/${locale}${p}`,
    languages: {
      fr: `${BASE_URL}/fr${p}`,
      en: `${BASE_URL}/en${p}`,
      "x-default": `${BASE_URL}/fr${p}`,
    },
  }
}
