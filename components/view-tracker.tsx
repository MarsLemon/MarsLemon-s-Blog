"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  postId: number
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/analytics/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        })
      } catch (error) {
        console.error("Failed to track view:", error)
      }
    }

    trackView()
  }, [postId])

  return null // This component doesn't render anything
}
