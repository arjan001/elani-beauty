import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Count unique sessions (human only) in the last 5 minutes as "active users"
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { data: recentViews, error } = await supabase
      .from("page_views")
      .select("session_id")
      .gte("created_at", fiveMinAgo)
      .eq("is_bot", false)

    if (error) {
      console.error("[v0] Realtime analytics error:", error)
    }

    // Count unique sessions, not raw page views
    const uniqueSessions = new Set((recentViews || []).map(v => v.session_id).filter(Boolean)).size

    return NextResponse.json({
      activeUsers: uniqueSessions,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ activeUsers: 0 }, { status: 500 })
  }
}
