"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "./admin-shell"
import { formatPrice } from "@/lib/format"
import { TrendingUp, TrendingDown, Users, ShoppingBag, Eye, DollarSign, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Globe, Monitor, Smartphone, Tablet, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Order {
  id: string; total: number; status: string; date: string; customer: string; orderNo: string
  items: { name: string; qty: number; price: number }[]
}

interface Product {
  id: string; name: string; price: number; category: string
}

interface VisitorData {
  totalViews: number; uniqueSessions: number; previousPeriodViews: number
  topPages: { page: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
  devices: { device: string; count: number; percentage: number }[]
  browsers: { browser: string; count: number; percentage: number }[]
  countries: { country: string; count: number; percentage: number }[]
  referrers: { source: string; count: number }[]
  realTimeUsers?: number
}

export function AdminAnalytics() {
  const { data: orders = [] } = useSWR<Order[]>("/api/admin/orders", fetcher)
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher)
  const { data: visitors } = useSWR<VisitorData>("/api/admin/analytics?days=30", fetcher)
  const [realTimeUsers, setRealTimeUsers] = useState(0)
  const [prodPage, setProdPage] = useState(1)
  const [activityPage, setActivityPage] = useState(1)

  // Real-time user tracking with pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/admin/analytics/realtime")
        .then((r) => r.json())
        .then((data) => setRealTimeUsers(data.activeUsers || 0))
        .catch(() => setRealTimeUsers(0))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Only confirmed orders count as sales (confirmed, dispatched, delivered)
  const saleStatuses = ["confirmed", "dispatched", "delivered"]
  const salesOrders = orders.filter((o) => saleStatuses.includes(o.status))
  const totalRevenue = salesOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const totalSales = salesOrders.length

  const viewChange = visitors ? Math.round(((visitors.totalViews - visitors.previousPeriodViews) / Math.max(visitors.previousPeriodViews, 1)) * 100) : 0

  const stats = [
    { label: "Sales Revenue", value: formatPrice(totalRevenue), change: `${totalSales} confirmed sales`, up: totalSales > 0, icon: DollarSign },
    { label: "Total Orders", value: totalOrders.toString(), change: `${orders.filter(o => o.status === "pending").length} pending`, up: true, icon: ShoppingBag },
    { label: "Page Views", value: visitors?.totalViews.toString() || "0", change: `${viewChange >= 0 ? "+" : ""}${viewChange}% vs prev`, up: viewChange >= 0, icon: Eye },
    { label: "Active Users Now", value: realTimeUsers.toString(), change: "Real-time visitors", up: true, icon: Activity },
  ]

  // Revenue by month from confirmed sales only
  const monthMap: Record<string, number> = {}
  salesOrders.forEach((o) => {
    const d = new Date(o.date)
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" })
    monthMap[key] = (monthMap[key] || 0) + o.total
  })
  const revenueByMonth = Object.entries(monthMap).slice(-6).map(([month, value]) => ({ month, value }))
  if (revenueByMonth.length === 0) revenueByMonth.push({ month: "Now", value: 0 })
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.value), 1)

  // Top products from confirmed sales only
  const productSales: Record<string, { name: string; sold: number; revenue: number }> = {}
  salesOrders.forEach((o) => {
    o.items.forEach((item) => {
      const key = item.name
      if (!productSales[key]) productSales[key] = { name: key, sold: 0, revenue: 0 }
      productSales[key].sold += item.qty
      productSales[key].revenue += item.price * item.qty
    })
  })
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue)
  const PROD_PER_PAGE = 5
  const prodTotalPages = Math.max(1, Math.ceil(topProducts.length / PROD_PER_PAGE))
  const pagedTopProducts = topProducts.slice((prodPage - 1) * PROD_PER_PAGE, prodPage * PROD_PER_PAGE)

  // Category breakdown from actual confirmed sales (matching items to products)
  const catSales: Record<string, { count: number; revenue: number }> = {}
  const productCategoryMap: Record<string, string> = {}
  products.forEach((p) => { productCategoryMap[p.name.toLowerCase()] = p.category })
  salesOrders.forEach((o) => {
    o.items.forEach((item) => {
      const category = productCategoryMap[item.name.toLowerCase()] || "Other"
      if (!catSales[category]) catSales[category] = { count: 0, revenue: 0 }
      catSales[category].count += item.qty
      catSales[category].revenue += item.price * item.qty
    })
  })
  const totalCatSold = Object.values(catSales).reduce((s, c) => s + c.count, 0) || 1
  const topCategories = Object.entries(catSales)
    .map(([name, data]) => ({ name, sold: data.count, revenue: data.revenue, percentage: Math.round((data.count / totalCatSold) * 100) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)

  // Recent activity from orders (as live feed)
  const recentActivity = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((o) => {
      const statusAction = o.status === "pending" ? "New order" : o.status === "dispatched" ? "Order dispatched" : o.status === "delivered" ? "Order delivered" : `Order ${o.status}`
      const ago = getTimeAgo(new Date(o.date))
      return { action: statusAction, detail: `${o.orderNo} by ${o.customer} - ${formatPrice(o.total)}`, time: ago }
    })
  const ACT_PER_PAGE = 5
  const actTotalPages = Math.max(1, Math.ceil(recentActivity.length / ACT_PER_PAGE))
  const pagedActivity = recentActivity.slice((activityPage - 1) * ACT_PER_PAGE, activityPage * ACT_PER_PAGE)

  return (
    <AdminShell title="Analytics">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-serif font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Store performance overview for the last 30 days.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-border p-5 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? <ArrowUpRight className="h-3 w-3 text-foreground" /> : <ArrowDownRight className="h-3 w-3 text-muted-foreground" />}
                <span className={`text-xs ${stat.up ? "text-foreground" : "text-muted-foreground"}`}>{stat.change} vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="bg-secondary flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="sales">Sales & Orders</TabsTrigger>
            <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-6 space-y-6">

        {/* Revenue Chart (simple bar chart) */}
        <div className="border border-border rounded-sm p-6">
          <h2 className="text-sm font-semibold mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {revenueByMonth.map((r) => (
              <div key={r.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{formatPrice(r.value)}</span>
                <div className="w-full bg-foreground rounded-t-sm transition-all" style={{ height: `${(r.value / maxRevenue) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{r.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="border border-border rounded-sm">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Top Selling Products</h2>
            </div>
            <div className="divide-y divide-border">
              {pagedTopProducts.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">No sales data yet</div>
              ) : pagedTopProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5">{(prodPage - 1) * PROD_PER_PAGE + i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
            {prodTotalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-secondary/30">
                <span className="text-[11px] text-muted-foreground">{prodPage}/{prodTotalPages}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={prodPage === 1} onClick={() => setProdPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={prodPage === prodTotalPages} onClick={() => setProdPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            )}
          </div>

          {/* Sales by Category */}
          <div className="border border-border rounded-sm">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Sales by Category</h2>
            </div>
            <div className="p-5 space-y-4">
              {topCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No sales data yet</p>
              )}
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.sold} sold -- {formatPrice(c.revenue)} ({c.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-border rounded-sm">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {pagedActivity.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">No recent activity</div>
            ) : pagedActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
          {actTotalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-secondary/30">
              <span className="text-[11px] text-muted-foreground">Page {activityPage}/{actTotalPages}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={activityPage === 1} onClick={() => setActivityPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={activityPage === actTotalPages} onClick={() => setActivityPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          )}
        </div>

          </TabsContent>

          <TabsContent value="traffic" className="mt-6 space-y-6">
            {/* Daily traffic chart */}
            <DailyViewsChart viewsByDay={visitors?.viewsByDay || []} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="border border-border rounded-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> Top Pages</h2>
                </div>
                <div className="divide-y divide-border">
                  {(visitors?.topPages || []).length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">No page data yet</div>
                  ) : (visitors?.topPages || []).map((p, i) => (
                    <div key={p.page} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm">{p.page}</span>
                      </div>
                      <span className="text-sm font-medium">{p.count} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="border border-border rounded-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Traffic Sources</h2>
                </div>
                <div className="divide-y divide-border">
                  {(visitors?.referrers || []).length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">No referrer data yet</div>
                  ) : (visitors?.referrers || []).map((r, i) => (
                    <div key={r.source} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm">{r.source}</span>
                      </div>
                      <span className="text-sm font-medium">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Devices */}
              <div className="border border-border rounded-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold">Devices</h2>
                </div>
                <div className="p-5 space-y-3">
                  {(visitors?.devices || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">No data</p>
                  ) : (visitors?.devices || []).map((d) => {
                    const DevIcon = d.device === "mobile" ? Smartphone : d.device === "tablet" ? Tablet : Monitor
                    return (
                      <div key={d.device}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm flex items-center gap-2 capitalize"><DevIcon className="h-3.5 w-3.5 text-muted-foreground" /> {d.device}</span>
                          <span className="text-xs text-muted-foreground">{d.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${d.percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Browsers */}
              <div className="border border-border rounded-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold">Browsers</h2>
                </div>
                <div className="p-5 space-y-3">
                  {(visitors?.browsers || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">No data</p>
                  ) : (visitors?.browsers || []).map((b) => (
                    <div key={b.browser}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{b.browser}</span>
                        <span className="text-xs text-muted-foreground">{b.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${b.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="border border-border rounded-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold">Countries</h2>
                </div>
                <div className="p-5 space-y-3">
                  {(visitors?.countries || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">No data</p>
                  ) : (visitors?.countries || []).map((c) => (
                    <div key={c.country}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{c.country}</span>
                        <span className="text-xs text-muted-foreground">{c.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${c.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  )
}

function DailyViewsChart({ viewsByDay }: { viewsByDay: { date: string; count: number }[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const maxViews = Math.max(...viewsByDay.map((v) => v.count), 1)
  const totalViews = viewsByDay.reduce((s, d) => s + d.count, 0)

  if (viewsByDay.length === 0 || totalViews === 0) {
    return (
      <div className="border border-border rounded-sm p-6">
        <h2 className="text-sm font-semibold mb-6">Daily Page Views (Last 30 Days)</h2>
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          No traffic data yet. Views will appear as visitors browse your site.
        </div>
      </div>
    )
  }

  // Show labels every ~5 days to avoid crowding
  const labelInterval = Math.max(1, Math.ceil(viewsByDay.length / 7))

  return (
    <div className="border border-border rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold">Daily Page Views (Last 30 Days)</h2>
        <span className="text-xs text-muted-foreground">{totalViews} total views</span>
      </div>
      <div className="relative">
        {/* Y-axis guides */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[1, 0.75, 0.5, 0.25, 0].map((pct) => (
            <div key={pct} className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-7 text-right flex-shrink-0">{Math.round(maxViews * pct)}</span>
              <div className="flex-1 border-b border-border/40" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-[2px] h-48 pl-9 relative">
          {viewsByDay.map((d, i) => {
            const heightPct = (d.count / maxViews) * 100
            const isHovered = hoveredIndex === i
            return (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-sm whitespace-nowrap z-10 shadow-lg">
                    {new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" })}: {d.count} view{d.count !== 1 ? "s" : ""}
                  </div>
                )}
                <div
                  className={`w-full rounded-t-sm transition-all duration-150 ${isHovered ? "bg-foreground" : "bg-foreground/70"}`}
                  style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? "3px" : "1px" }}
                />
              </div>
            )
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex pl-9 mt-2">
          {viewsByDay.map((d, i) => (
            <div key={d.date} className="flex-1 text-center">
              {i % labelInterval === 0 && (
                <span className="text-[9px] text-muted-foreground">{new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return date.toLocaleDateString()
}
