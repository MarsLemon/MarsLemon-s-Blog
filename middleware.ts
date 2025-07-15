import createMiddleware from "next-intl/middleware"
import { locales } from "./lib/i18n"

export default createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
})

export const config = {
  // Skip API routes, Next.js internals, static files AND any path that starts with “_”
  matcher: ["/((?!api|_next|_vercel|_.*|.*\\..*).*)"],
}
