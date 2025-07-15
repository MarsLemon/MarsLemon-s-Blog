import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// 支持的语言列表
export const locales = [
  "en", // English
  "zh", // 中文
  "ja", // 日本語
  "ko", // 한국어
  "es", // Español
  "fr", // Français
  "de", // Deutsch
  "it", // Italiano
  "pt", // Português
  "ru", // Русский
  "ar", // العربية
  "hi", // हिन्दी
  "th", // ไทย
  "vi", // Tiếng Việt
  "tr", // Türkçe
  "pl", // Polski
  "nl", // Nederlands
  "sv", // Svenska
  "da", // Dansk
  "no", // Norsk
] as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
