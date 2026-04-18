import { NextRequest, NextResponse } from "next/server"
import { getPageViews, getEvents } from "@/lib/analytics-store"
import { requireAuth } from "@/lib/security"

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const { searchParams } = new URL(request.url)
  const days = Math.min(30, Math.max(1, parseInt(searchParams.get("days") || "7")))
  const limit = Math.min(200, Math.max(10, parseInt(searchParams.get("limit") || "50")))

  try {
    const [views, events] = await Promise.all([
      getPageViews(days),
      getEvents(days),
    ])

    const humanViews = views.filter(v => !v.is_bot)

    // Group by session_id
    const sessionMap: Record<string, typeof humanViews> = {}
    for (const v of humanViews) {
      if (!v.session_id) continue
      if (!sessionMap[v.session_id]) sessionMap[v.session_id] = []
      sessionMap[v.session_id].push(v)
    }

    const clicksBySession: Record<string, number> = {}
    for (const e of events) {
      if (e.event_type === "click" && !e.is_bot && e.session_id) {
        clicksBySession[e.session_id] = (clicksBySession[e.session_id] || 0) + 1
      }
    }

    // Build session summaries
    const sessions = Object.entries(sessionMap).map(([sid, sessionViews]) => {
      // Sort oldest-first for journey ordering
      const sorted = [...sessionViews].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      const first = sorted[0]
      const last = sorted[sorted.length - 1]
      const totalDuration = sorted.reduce((sum, v) => sum + (v.duration_seconds || 0), 0)
      // If durations weren't captured, fallback to elapsed between first and last view
      const elapsed = new Date(last.created_at).getTime() - new Date(first.created_at).getTime()
      const durationSeconds = totalDuration > 0
        ? totalDuration
        : Math.round(elapsed / 1000)

      const journey = sorted.map(v => ({
        path: v.page_path,
        at: v.created_at,
        duration: v.duration_seconds || 0,
        scroll: v.scroll_depth || 0,
      }))

      let referrerHost = ""
      if (first.referrer) {
        try { referrerHost = new URL(first.referrer).hostname } catch { /* ignore */ }
      }

      return {
        sessionId: sid,
        visitorId: first.visitor_id || "",
        isReturning: first.is_returning === true,
        country: first.country || "",
        countryName: first.country_name || "",
        city: first.city || "",
        region: first.region || "",
        device: first.device_type || "desktop",
        browser: first.browser || "",
        language: first.language || "",
        ip: first.ip_address || "",
        referrer: referrerHost || "Direct",
        utmSource: first.utm_source || "",
        utmMedium: first.utm_medium || "",
        utmCampaign: first.utm_campaign || "",
        pageCount: sorted.length,
        clickCount: clicksBySession[sid] || 0,
        maxScroll: Math.max(...sorted.map(v => v.scroll_depth || 0), 0),
        durationSeconds,
        startedAt: first.created_at,
        endedAt: last.created_at,
        entryPage: first.page_path,
        exitPage: last.page_path,
        journey,
      }
    })

    // Sort most-recent-first and limit
    sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    const limited = sessions.slice(0, limit)

    // Hourly distribution (0-23) based on human views
    const hourly: { hour: number; count: number }[] = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }))
    humanViews.forEach(v => {
      const h = new Date(v.created_at).getHours()
      hourly[h].count++
    })

    // Unique IPs (privacy-light summary, non-bot only)
    const ipMap: Record<string, { count: number; country: string; city: string; lastSeen: string }> = {}
    humanViews.forEach(v => {
      if (!v.ip_address) return
      if (!ipMap[v.ip_address]) ipMap[v.ip_address] = { count: 0, country: v.country_name || v.country || "", city: v.city || "", lastSeen: v.created_at }
      ipMap[v.ip_address].count++
      if (new Date(v.created_at) > new Date(ipMap[v.ip_address].lastSeen)) {
        ipMap[v.ip_address].lastSeen = v.created_at
      }
    })
    const topIps = Object.entries(ipMap)
      .map(([ip, data]) => ({ ip, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25)

    return NextResponse.json({
      totalSessions: sessions.length,
      sessions: limited,
      hourly,
      topIps,
    })
  } catch (err) {
    console.error("Failed to load sessions:", err)
    return NextResponse.json({ totalSessions: 0, sessions: [], hourly: [], topIps: [] }, { status: 500 })
  }
}
