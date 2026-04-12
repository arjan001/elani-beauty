import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Count unique page views in the last 5 minutes as "active users"
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { count, error } = await supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fiveMinAgo)

    if (error) {
      console.error("[v0] Realtime analytics error:", error)
    }

    return NextResponse.json({
      activeUsers: count || 0,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ activeUsers: 0 }, { status: 500 })
  }
}
