import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "30")

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  const prevSince = new Date()
  prevSince.setDate(prevSince.getDate() - days * 2)
  const prevSinceISO = prevSince.toISOString()

  // Current period views (including new enhanced columns if available)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentViews: any[] | null = null
  const { data: viewsData, error: viewsError } = await supabase
    .from("page_views")
    .select("id, page_path, referrer, country, device_type, browser, created_at, session_id, duration_seconds, is_bot, scroll_depth, visitor_id, is_returning, language, utm_source, utm_medium, utm_campaign")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })
  currentViews = viewsData

  // Fallback: if new columns don't exist yet (migration not run), query without them
  if (viewsError && viewsError.message?.includes("column")) {
    const fallback = await supabase
      .from("page_views")
      .select("id, page_path, referrer, country, device_type, browser, created_at, session_id, duration_seconds, is_bot, scroll_depth")
      .gte("created_at", sinceISO)
      .order("created_at", { ascending: false })
    currentViews = fallback.data
  }

  // Previous period views for comparison
  const { count: prevViewCount } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .gte("created_at", prevSinceISO)
    .lt("created_at", sinceISO)

  // Orders/sales data for the period
  const { data: currentOrders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })

  const { data: prevOrders } = await supabase
    .from("orders")
    .select("id, total")
    .gte("created_at", prevSinceISO)
    .lt("created_at", sinceISO)

  // Analytics events (clicks, interactions)
  const { data: events } = await supabase
    .from("analytics_events")
    .select("id, event_type, event_target, event_data, page_path, session_id, is_bot, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })
    .limit(5000)

  // Abandoned checkouts
  const { data: abandonedData } = await supabase
    .from("abandoned_checkouts")
    .select("id, session_id, customer_name, customer_phone, items, subtotal, step_reached, device_type, recovered, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })
    .limit(200)

  const views = currentViews || []
  const orders = currentOrders || []
  const allEvents = events || []
  const abandoned = abandonedData || []

  const totalViews = views.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const prevOrderCount = prevOrders?.length || 0
  const prevRevenue = (prevOrders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  // Separate human vs bot views
  const humanViews = views.filter(v => !v.is_bot)
  const botViews = views.filter(v => v.is_bot)
  const humanViewCount = humanViews.length
  const botViewCount = botViews.length

  // Unique sessions (human only)
  const uniqueSessions = new Set(humanViews.map(v => v.session_id).filter(Boolean)).size

  // Average session duration (human only, views with duration > 0)
  const viewsWithDuration = humanViews.filter(v => v.duration_seconds && v.duration_seconds > 0)
  const avgDuration = viewsWithDuration.length > 0
    ? Math.round(viewsWithDuration.reduce((sum, v) => sum + v.duration_seconds, 0) / viewsWithDuration.length)
    : 0

  // Average scroll depth (human only)
  const viewsWithScroll = humanViews.filter(v => v.scroll_depth && v.scroll_depth > 0)
  const avgScrollDepth = viewsWithScroll.length > 0
    ? Math.round(viewsWithScroll.reduce((sum, v) => sum + v.scroll_depth, 0) / viewsWithScroll.length)
    : 0

  // Bounce rate: sessions with only 1 page view / total sessions
  const sessionPageCounts: Record<string, number> = {}
  humanViews.forEach(v => {
    if (v.session_id) sessionPageCounts[v.session_id] = (sessionPageCounts[v.session_id] || 0) + 1
  })
  const totalSessions = Object.keys(sessionPageCounts).length || 1
  const bounceSessions = Object.values(sessionPageCounts).filter(c => c === 1).length
  const bounceRate = Math.round((bounceSessions / totalSessions) * 100)

  // Sales by day
  const salesByDay: Record<string, { orders: number; revenue: number }> = {}
  orders.forEach((o) => {
    const day = new Date(o.created_at).toISOString().split("T")[0]
    if (!salesByDay[day]) salesByDay[day] = { orders: 0, revenue: 0 }
    salesByDay[day].orders++
    salesByDay[day].revenue += Number(o.total) || 0
  })
  const salesTimeline: { date: string; orders: number; revenue: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    salesTimeline.push({ date: key, orders: salesByDay[key]?.orders || 0, revenue: salesByDay[key]?.revenue || 0 })
  }

  // Views by page (human only)
  const pageMap: Record<string, number> = {}
  humanViews.forEach((v) => { pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1 })
  const topPages = Object.entries(pageMap)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Page retention: avg duration per page
  const pageDuration: Record<string, { total: number; count: number }> = {}
  viewsWithDuration.forEach(v => {
    if (!pageDuration[v.page_path]) pageDuration[v.page_path] = { total: 0, count: 0 }
    pageDuration[v.page_path].total += v.duration_seconds
    pageDuration[v.page_path].count++
  })
  const pageRetention = Object.entries(pageDuration)
    .map(([page, d]) => ({ page, avgDuration: Math.round(d.total / d.count), views: d.count }))
    .sort((a, b) => b.avgDuration - a.avgDuration)
    .slice(0, 15)

  // Views by day
  const dayMap: Record<string, { total: number; human: number; bot: number }> = {}
  views.forEach((v) => {
    const day = new Date(v.created_at).toISOString().split("T")[0]
    if (!dayMap[day]) dayMap[day] = { total: 0, human: 0, bot: 0 }
    dayMap[day].total++
    if (v.is_bot) dayMap[day].bot++
    else dayMap[day].human++
  })
  const viewsByDay: { date: string; count: number; human: number; bot: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    viewsByDay.push({
      date: key,
      count: dayMap[key]?.total || 0,
      human: dayMap[key]?.human || 0,
      bot: dayMap[key]?.bot || 0,
    })
  }

  // Device breakdown (human only)
  const deviceMap: Record<string, number> = {}
  humanViews.forEach((v) => {
    const d = v.device_type || "desktop"
    deviceMap[d] = (deviceMap[d] || 0) + 1
  })
  const devices = Object.entries(deviceMap).map(([device, count]) => ({
    device, count, percentage: Math.round((count / Math.max(humanViewCount, 1)) * 100)
  }))

  // Browser breakdown (human only)
  const browserMap: Record<string, number> = {}
  humanViews.forEach((v) => { browserMap[v.browser || "Unknown"] = (browserMap[v.browser || "Unknown"] || 0) + 1 })
  const browsers = Object.entries(browserMap)
    .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / Math.max(humanViewCount, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Country breakdown (human only)
  const countryMap: Record<string, number> = {}
  humanViews.forEach((v) => { if (v.country) countryMap[v.country] = (countryMap[v.country] || 0) + 1 })
  const countries = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count, percentage: Math.round((count / Math.max(humanViewCount, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top referrers (human only)
  const refMap: Record<string, number> = {}
  humanViews.forEach((v) => {
    if (v.referrer) {
      try { refMap[new URL(v.referrer).hostname] = (refMap[new URL(v.referrer).hostname] || 0) + 1 } catch { /* ignore */ }
    } else {
      refMap["Direct"] = (refMap["Direct"] || 0) + 1
    }
  })
  const referrers = Object.entries(refMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Click events summary
  const clickEvents = allEvents.filter(e => e.event_type === "click" && !e.is_bot)
  const totalClicks = clickEvents.length

  // Top clicked elements
  const clickTargetMap: Record<string, number> = {}
  clickEvents.forEach(e => {
    const target = e.event_target || "Unknown"
    clickTargetMap[target] = (clickTargetMap[target] || 0) + 1
  })
  const topClicks = Object.entries(clickTargetMap)
    .map(([target, count]) => ({ target, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  // Clicks by page
  const clickPageMap: Record<string, number> = {}
  clickEvents.forEach(e => {
    clickPageMap[e.page_path || "/"] = (clickPageMap[e.page_path || "/"] || 0) + 1
  })
  const clicksByPage = Object.entries(clickPageMap)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ===== ENHANCED ANALYTICS: Traffic Source Categorization =====
  const searchEngines = ["google", "bing", "yahoo", "duckduckgo", "baidu", "yandex", "ecosia", "brave"]
  const socialNetworks = ["facebook", "instagram", "tiktok", "twitter", "x.com", "linkedin", "pinterest", "reddit", "youtube", "snapchat", "whatsapp", "t.co"]
  const emailProviders = ["mail", "email", "outlook", "gmail", "newsletter"]

  function categorizeSource(referrer: string, utmMedium?: string, utmSource?: string): string {
    // UTM medium takes highest priority (like Google Analytics)
    if (utmMedium) {
      const med = utmMedium.toLowerCase()
      if (med === "cpc" || med === "ppc" || med === "paid" || med === "paidsearch") return "Paid Search"
      if (med === "social" || med === "paid_social" || med === "paidsocial") return "Social"
      if (med === "email" || med === "e-mail") return "Email"
      if (med === "organic") return "Organic Search"
      if (med === "referral") return "Referral"
      if (med === "display" || med === "banner" || med === "cpm") return "Display"
      if (med === "affiliate") return "Affiliate"
    }
    // UTM source as secondary signal
    if (utmSource) {
      const src = utmSource.toLowerCase()
      if (searchEngines.some(se => src.includes(se))) return "Organic Search"
      if (socialNetworks.some(sn => src.includes(sn))) return "Social"
      if (emailProviders.some(ep => src.includes(ep))) return "Email"
    }
    // Referrer-based detection
    if (!referrer) return "Direct"
    try {
      const host = new URL(referrer).hostname.toLowerCase()
      if (searchEngines.some(se => host.includes(se))) return "Organic Search"
      if (socialNetworks.some(sn => host.includes(sn))) return "Social"
      if (emailProviders.some(ep => host.includes(ep))) return "Email"
      return "Referral"
    } catch {
      return "Direct"
    }
  }

  const sourceCategories: Record<string, number> = {}
  humanViews.forEach(v => {
    const cat = categorizeSource(v.referrer || "", v.utm_medium, v.utm_source)
    sourceCategories[cat] = (sourceCategories[cat] || 0) + 1
  })
  const trafficChannels = Object.entries(sourceCategories)
    .map(([channel, count]) => ({ channel, count, percentage: Math.round((count / Math.max(humanViewCount, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)

  // ===== New vs Returning Visitors =====
  // Count unique visitor IDs; if is_returning is set, use it; otherwise estimate from session data
  const visitorMap: Record<string, boolean> = {}
  humanViews.forEach(v => {
    const vid = v.visitor_id || v.session_id
    if (vid && visitorMap[vid] === undefined) {
      visitorMap[vid] = v.is_returning === true
    }
  })
  const totalUniqueVisitors = Object.keys(visitorMap).length || 1
  const returningVisitors = Object.values(visitorMap).filter(r => r).length
  const newVisitors = totalUniqueVisitors - returningVisitors
  const newVsReturning = {
    new: newVisitors,
    returning: returningVisitors,
    newPercentage: Math.round((newVisitors / totalUniqueVisitors) * 100),
    returningPercentage: Math.round((returningVisitors / totalUniqueVisitors) * 100),
  }

  // ===== UTM Campaign Data =====
  const campaignMap: Record<string, { views: number; source: string; medium: string }> = {}
  humanViews.forEach(v => {
    if (v.utm_campaign) {
      if (!campaignMap[v.utm_campaign]) {
        campaignMap[v.utm_campaign] = { views: 0, source: v.utm_source || "", medium: v.utm_medium || "" }
      }
      campaignMap[v.utm_campaign].views++
    }
  })
  const utmCampaigns = Object.entries(campaignMap)
    .map(([campaign, data]) => ({ campaign, views: data.views, source: data.source, medium: data.medium }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Also aggregate UTM events for richer campaign data
  const utmEvents = allEvents.filter(e => e.event_type === "utm_landing" && !e.is_bot)
  const utmSourceMap: Record<string, number> = {}
  utmEvents.forEach(e => {
    const src = (e.event_data as Record<string, string>)?.utm_source || "unknown"
    utmSourceMap[src] = (utmSourceMap[src] || 0) + 1
  })
  const utmSources = Object.entries(utmSourceMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ===== Language Breakdown =====
  const langMap: Record<string, number> = {}
  humanViews.forEach(v => {
    if (v.language) {
      const lang = v.language.split("-")[0] // "en-US" -> "en"
      langMap[lang] = (langMap[lang] || 0) + 1
    }
  })
  const languages = Object.entries(langMap)
    .map(([language, count]) => ({ language, count, percentage: Math.round((count / Math.max(humanViewCount, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Abandoned checkouts summary
  const totalAbandoned = abandoned.length
  const recoveredCount = abandoned.filter(a => a.recovered).length
  const abandonedValue = abandoned.reduce((sum, a) => sum + (Number(a.subtotal) || 0), 0)
  const abandonedByStep: Record<string, number> = {}
  abandoned.forEach(a => {
    abandonedByStep[a.step_reached || "cart"] = (abandonedByStep[a.step_reached || "cart"] || 0) + 1
  })

  return NextResponse.json({
    // Basic metrics
    totalViews,
    humanViewCount,
    botViewCount,
    previousPeriodViews: prevViewCount || 0,
    uniqueSessions,
    avgDuration,
    avgScrollDepth,
    bounceRate,

    // Sales
    totalOrders,
    totalRevenue,
    prevOrderCount,
    prevRevenue,

    // Time series
    topPages,
    pageRetention,
    viewsByDay,
    salesTimeline,

    // Breakdowns
    devices,
    browsers,
    countries,
    referrers,

    // Interactions
    totalClicks,
    topClicks,
    clicksByPage,

    // Bot traffic
    botTraffic: {
      total: botViewCount,
      percentage: totalViews > 0 ? Math.round((botViewCount / totalViews) * 100) : 0,
    },

    // Abandoned checkouts
    abandonedCheckouts: {
      total: totalAbandoned,
      recovered: recoveredCount,
      value: abandonedValue,
      byStep: abandonedByStep,
      recent: abandoned.slice(0, 10).map(a => ({
        id: a.id,
        customerName: a.customer_name || "Anonymous",
        items: a.items,
        subtotal: a.subtotal,
        stepReached: a.step_reached,
        recovered: a.recovered,
        createdAt: a.created_at,
      })),
    },

    // Enhanced analytics
    trafficChannels,
    newVsReturning,
    utmCampaigns,
    utmSources,
    languages,
  })
}
