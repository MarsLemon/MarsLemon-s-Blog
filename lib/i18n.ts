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

export const defaultLocale: Locale = "en"

// 语言显示名称和国旗
export const languageNames: Record<Locale, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  zh: { name: "中文", flag: "🇨🇳" },
  ja: { name: "日本語", flag: "🇯🇵" },
  ko: { name: "한국어", flag: "🇰🇷" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  it: { name: "Italiano", flag: "🇮🇹" },
  pt: { name: "Português", flag: "🇵🇹" },
  ru: { name: "Русский", flag: "🇷🇺" },
  ar: { name: "العربية", flag: "🇸🇦" },
  hi: { name: "हिन्दी", flag: "🇮🇳" },
  th: { name: "ไทย", flag: "🇹🇭" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  tr: { name: "Türkçe", flag: "🇹🇷" },
  pl: { name: "Polski", flag: "🇵🇱" },
  nl: { name: "Nederlands", flag: "🇳🇱" },
  sv: { name: "Svenska", flag: "🇸🇪" },
  da: { name: "Dansk", flag: "🇩🇰" },
  no: { name: "Norsk", flag: "🇳🇴" },
}

// 检查是否为有效的语言代码
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
