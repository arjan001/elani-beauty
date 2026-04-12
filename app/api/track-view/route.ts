import { createAdminClient as createClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"
import { rateLimit, rateLimitResponse, sanitize } from "@/lib/security"

export async function POST(request: NextRequest) {
  // Rate limit: max 60 page views per minute per IP (generous for normal browsing)
  const rl = rateLimit(request, { limit: 60, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const userAgent = request.headers.get("user-agent") || ""

    // Block obvious bots/scanners
    const botPatterns = /bot|crawl|spider|scraper|curl|wget|python|java|go-http|headless/i
    if (botPatterns.test(userAgent)) {
      return NextResponse.json({ success: true }) // silent drop
    }

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "Unknown"
    const deviceType = parser.getDevice().type || "desktop"

    const country = request.headers.get("x-vercel-ip-country") || ""

    const supabase = createClient()
    const { error } = await supabase.from("page_views").insert({
      page_path: sanitize(body.path || "/", 500),
      referrer: sanitize(body.referrer || "", 2000),
      user_agent: userAgent.slice(0, 500),
      country: country || null,
      device_type: deviceType,
      browser,
    })

    if (error) {
      console.error("Failed to track view:", error)
      return NextResponse.json({ error: "Failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
