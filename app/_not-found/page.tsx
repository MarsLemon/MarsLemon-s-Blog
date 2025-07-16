"use client"

// Ensure this route is handled dynamically so Next.js does not try
// to prerender it at build time.
export const dynamic = "force-dynamic"

export default function FrameworkNotFound() {
  // We simply render nothing because the framework will replace this
  // with its own 404 UI at runtime.
  return null
}
