import createMiddleware from "next-intl/middleware";
import { locales } from "./lib/i18n";

export default createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const config = {
  // Skip API routes, Next.js internals, the Next.js not-found helper,
  // static files, and any path that starts with “_”
  matcher: ["/((?!api|_next|_vercel|_.*|.*\\..*).*)"],
};
