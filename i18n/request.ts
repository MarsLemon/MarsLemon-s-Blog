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
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
