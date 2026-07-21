const BASE_URL = "https://ydvsystems.com"

export function localeUrl(locale: string, path: string = "") {
  if (locale === "fr") {
    return path ? `${BASE_URL}${path}` : `${BASE_URL}/`
  }
  return `${BASE_URL}/en${path}`
}

export function getPageAlternates(locale: string, path: string = "") {
  const p = path ? `/${path}` : ""
  return {
    canonical: localeUrl(locale, p),
    languages: {
      fr: localeUrl("fr", p),
      en: localeUrl("en", p),
      "x-default": localeUrl("fr", p),
    },
  }
}
