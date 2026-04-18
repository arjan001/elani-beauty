import { NextResponse } from "next/server"
import { getActiveSessionDetails } from "@/lib/analytics-store"
import { requireAuth } from "@/lib/security"

export async function GET() {
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  try {
    const sessions = await getActiveSessionDetails(5)
    const now = Date.now()

    const visitors = sessions.map((s) => {
      let referrerHost = ""
      if (s.referrer) {
        try { referrerHost = new URL(s.referrer).hostname } catch { /* ignore */ }
      }
      return {
        sessionId: s.session_id,
        visitorId: s.visitor_id || "",
        page: s.page_path || "/",
        referrer: referrerHost || "Direct",
        country: s.country || "",
        countryName: s.country_name || "",
        city: s.city || "",
        region: s.region || "",
        latitude: s.latitude || 0,
        longitude: s.longitude || 0,
        device: s.device_type || "desktop",
        browser: s.browser || "",
        ip: s.ip_address || "",
        isReturning: s.is_returning === true,
        lastSeenSecondsAgo: Math.max(0, Math.round((now - s.ts) / 1000)),
        durationSeconds: s.started_at ? Math.max(0, Math.round((now - s.started_at) / 1000)) : 0,
      }
    })

    // Geographic cluster for simple map: group by coordinates
    const geoPoints: { lat: number; lng: number; count: number; city: string; country: string }[] = []
    const pointMap: Record<string, { lat: number; lng: number; count: number; city: string; country: string }> = {}
    for (const v of visitors) {
      if (!v.latitude || !v.longitude) continue
      const key = `${v.latitude.toFixed(2)},${v.longitude.toFixed(2)}`
      if (!pointMap[key]) {
        pointMap[key] = { lat: v.latitude, lng: v.longitude, count: 0, city: v.city, country: v.countryName || v.country }
      }
      pointMap[key].count++
    }
    for (const k in pointMap) geoPoints.push(pointMap[k])

    return NextResponse.json({
      total: visitors.length,
      visitors,
      geoPoints,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Failed to load live visitors:", err)
    return NextResponse.json({ total: 0, visitors: [], geoPoints: [] }, { status: 500 })
  }
}
