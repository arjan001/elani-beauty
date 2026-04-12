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

  // Current period views
  const { data: currentViews } = await supabase
    .from("page_views")
    .select("id, page_path, referrer, country, device_type, browser, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: false })

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

  const views = currentViews || []
  const orders = currentOrders || []
  const totalViews = views.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const prevOrderCount = prevOrders?.length || 0
  const prevRevenue = (prevOrders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0)

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

  // Views by page
  const pageMap: Record<string, number> = {}
  views.forEach((v) => { pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1 })
  const topPages = Object.entries(pageMap)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Views by day - fill all days in range so chart has no gaps
  const dayMap: Record<string, number> = {}
  views.forEach((v) => {
    const day = new Date(v.created_at).toISOString().split("T")[0]
    dayMap[day] = (dayMap[day] || 0) + 1
  })
  const viewsByDay: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    viewsByDay.push({ date: key, count: dayMap[key] || 0 })
  }

  // Device breakdown
  const deviceMap: Record<string, number> = {}
  views.forEach((v) => {
    const d = v.device_type || "desktop"
    deviceMap[d] = (deviceMap[d] || 0) + 1
  })
  const devices = Object.entries(deviceMap).map(([device, count]) => ({ device, count, percentage: Math.round((count / Math.max(totalViews, 1)) * 100) }))

  // Browser breakdown
  const browserMap: Record<string, number> = {}
  views.forEach((v) => { browserMap[v.browser || "Unknown"] = (browserMap[v.browser || "Unknown"] || 0) + 1 })
  const browsers = Object.entries(browserMap)
    .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / Math.max(totalViews, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Country breakdown
  const countryMap: Record<string, number> = {}
  views.forEach((v) => { if (v.country) countryMap[v.country] = (countryMap[v.country] || 0) + 1 })
  const countries = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count, percentage: Math.round((count / Math.max(totalViews, 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top referrers
  const refMap: Record<string, number> = {}
  views.forEach((v) => {
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

  return NextResponse.json({
    totalViews,
    previousPeriodViews: prevViewCount || 0,
    totalOrders,
    totalRevenue,
    prevOrderCount,
    prevRevenue,
    topPages,
    viewsByDay,
    salesTimeline,
    devices,
    browsers,
    countries,
    referrers,
  })
}
