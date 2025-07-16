import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Supported locale codes
export const locales = [
  "en",
  "zh",
  "ja",
  "ko",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "ar",
  "hi",
  "th",
  "vi",
  "tr",
  "pl",
  "nl",
  "sv",
  "da",
  "no",
] as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // If the locale is the internal Next.js _not-found path, return empty messages
  // to prevent the build from crashing during prerendering.
  if (locale === "_not-found") {
    return {
      messages: {},
    }
  }

  // For actual locales, proceed as usual
  //if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
