import createMiddleware from "next-intl/middleware"
import { locales } from "./lib/i18n"

export default createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
})

export const config = {
  // Skip API routes, Next.js internals, static files, and any path that starts with “_”
  // The _not-found path is now handled gracefully by i18n/request.ts
  matcher: ["/((?!api|_next|_vercel|_.*|.*\\..*).*)"],
}
