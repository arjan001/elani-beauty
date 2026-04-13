import { createAdminClient as createClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"
import { rateLimit, rateLimitResponse, sanitize } from "@/lib/security"

export async function POST(request: NextRequest) {
  // Rate limit: max 60 page views per minute per IP
  const rl = rateLimit(request, { limit: 60, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const userAgent = request.headers.get("user-agent") || ""

    // Bot detection - server-side
    const botPatterns = /bot|crawl|spider|scraper|curl|wget|python|java|go-http|headless|phantom|puppeteer|selenium|playwright/i
    const isServerBot = botPatterns.test(userAgent)
    const isBot = isServerBot || body.isBot === true

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "Unknown"
    const deviceType = parser.getDevice().type || "desktop"
    // Netlify geo: parse x-nf-geo JSON header, fallback to x-country or Vercel header
    let country = ""
    const nfGeo = request.headers.get("x-nf-geo")
    if (nfGeo) {
      try { country = JSON.parse(nfGeo)?.country?.code || "" } catch { /* ignore */ }
    }
    if (!country) country = request.headers.get("x-country") || request.headers.get("x-vercel-ip-country") || ""
    const ip = request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || ""

    const supabase = createClient()

    // Build insert payload — new columns (utm, visitor_id, etc.) added gracefully
    const insertData: Record<string, unknown> = {
      page_path: sanitize(body.path || "/", 500),
      referrer: sanitize(body.referrer || "", 2000),
      user_agent: userAgent.slice(0, 500),
      country: country || null,
      device_type: deviceType,
      browser,
      session_id: sanitize(body.sessionId || "", 100),
      is_bot: isBot,
      ip_address: ip.slice(0, 45),
    }

    // Add enhanced tracking fields (requires migration 14_analytics_real_tracking.sql)
    if (body.visitorId) insertData.visitor_id = sanitize(body.visitorId, 100)
    if (body.isReturning !== undefined) insertData.is_returning = body.isReturning === true
    if (body.language) insertData.language = sanitize(body.language, 20)
    if (body.utmSource) insertData.utm_source = sanitize(body.utmSource, 200)
    if (body.utmMedium) insertData.utm_medium = sanitize(body.utmMedium, 200)
    if (body.utmCampaign) insertData.utm_campaign = sanitize(body.utmCampaign, 200)

    let { error } = await supabase.from("page_views").insert(insertData)

    // If insert fails due to unknown columns (migration not yet run), retry with base columns only
    if (error && error.message?.includes("column")) {
      const baseData = {
        page_path: insertData.page_path,
        referrer: insertData.referrer,
        user_agent: insertData.user_agent,
        country: insertData.country,
        device_type: insertData.device_type,
        browser: insertData.browser,
        session_id: insertData.session_id,
        is_bot: insertData.is_bot,
        ip_address: insertData.ip_address,
      }
      const retry = await supabase.from("page_views").insert(baseData)
      error = retry.error
    }

    if (error) {
      console.error("Failed to track view:", error)
      return NextResponse.json({ error: "Failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// PATCH - Update duration and scroll depth for existing page view
export async function PATCH(request: NextRequest) {
  const rl = rateLimit(request, { limit: 60, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const sessionId = sanitize(body.sessionId || "", 100)
    const path = sanitize(body.path || "", 500)
    const duration = Math.min(3600, Math.max(0, Math.floor(Number(body.duration) || 0)))
    const scrollDepth = Math.min(100, Math.max(0, Math.floor(Number(body.scrollDepth) || 0)))

    if (!sessionId || !path) {
      return NextResponse.json({ success: true }) // silent drop
    }

    const supabase = createClient()

    // Update the most recent page view for this session + path
    const { data: views } = await supabase
      .from("page_views")
      .select("id")
      .eq("session_id", sessionId)
      .eq("page_path", path)
      .order("created_at", { ascending: false })
      .limit(1)

    if (views && views.length > 0) {
      await supabase
        .from("page_views")
        .update({ duration_seconds: duration, scroll_depth: scrollDepth })
        .eq("id", views[0].id)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
