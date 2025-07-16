"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Locale } from "./i18n"
import { defaultLocale, isValidLocale } from "./i18n"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// 翻译缓存
const translationCache: Record<Locale, any> = {}

// 加载翻译文件
async function loadTranslations(locale: Locale) {
  if (translationCache[locale]) {
    return translationCache[locale]
  }

  try {
    const translations = await import(`./translations/${locale}.json`)
    translationCache[locale] = translations.default
    return translations.default
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, falling back to ${defaultLocale}`)
    if (locale !== defaultLocale) {
      return loadTranslations(defaultLocale)
    }
    return {}
  }
}

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => current?.[key], obj) || path
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [translations, setTranslations] = useState<any>({})

  // 从localStorage加载语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale")
    if (savedLocale && isValidLocale(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // 加载翻译文件
  useEffect(() => {
    loadTranslations(locale).then(setTranslations)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string): string => {
    return getNestedValue(translations, key) || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
