"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

function getSessionId() {
  if (typeof window === "undefined") return ""
  let sid = sessionStorage.getItem("kf_sid")
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem("kf_sid", sid)
  }
  return sid
}

export function PageViewTracker() {
  const pathname = usePathname()
  const lastTracked = useRef("")

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return
    // Don't double-track same path
    if (lastTracked.current === pathname) return
    lastTracked.current = pathname

    const track = async () => {
      try {
        await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || "",
            sessionId: getSessionId(),
          }),
        })
      } catch {
        // Silently fail - tracking should never block the user
      }
    }

    // Small delay so it doesn't block page load
    const timeout = setTimeout(track, 500)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
