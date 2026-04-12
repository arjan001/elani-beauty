import { createAdminClient as createClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"
import { rateLimit, rateLimitResponse, sanitize } from "@/lib/security"

export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 120, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const userAgent = request.headers.get("user-agent") || ""

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "Unknown"
    const deviceType = parser.getDevice().type || "desktop"
    const country = request.headers.get("x-vercel-ip-country") || ""
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || ""

    // Bot detection from user agent
    const botPatterns = /bot|crawl|spider|scraper|curl|wget|python|java|go-http|headless|phantom|puppeteer|selenium|playwright/i
    const isServerBot = botPatterns.test(userAgent)
    const isBot = isServerBot || body.isBot === true

    const supabase = createClient()
    const { error } = await supabase.from("analytics_events").insert({
      event_type: sanitize(body.eventType || "click", 50),
      event_target: sanitize(body.eventTarget || "", 200),
      event_data: body.eventData || {},
      page_path: sanitize(body.pagePath || "/", 500),
      session_id: sanitize(body.sessionId || "", 100),
      device_type: deviceType,
      browser,
      country: country || null,
      is_bot: isBot,
      ip_address: ip.slice(0, 45),
    })

    if (error) {
      console.error("Failed to track event:", error)
      return NextResponse.json({ error: "Failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
