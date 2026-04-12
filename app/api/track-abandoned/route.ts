import { createAdminClient as createClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { UAParser } from "ua-parser-js"
import { rateLimit, rateLimitResponse, sanitize } from "@/lib/security"

export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 10, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  try {
    const body = await request.json()
    const userAgent = request.headers.get("user-agent") || ""
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "Unknown"
    const deviceType = parser.getDevice().type || "desktop"

    const supabase = createClient()

    // Check if we already have an abandoned checkout for this session
    const sessionId = sanitize(body.sessionId || "", 100)
    if (!sessionId) return NextResponse.json({ success: true })

    const { data: existing } = await supabase
      .from("abandoned_checkouts")
      .select("id")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (existing && existing.length > 0) {
      // Update existing
      await supabase
        .from("abandoned_checkouts")
        .update({
          customer_name: sanitize(body.customerName || "", 100),
          customer_phone: sanitize(body.customerPhone || "", 20),
          customer_email: sanitize(body.customerEmail || "", 320),
          items: body.items || [],
          subtotal: Math.max(0, Number(body.subtotal) || 0),
          step_reached: sanitize(body.stepReached || "cart", 50),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing[0].id)
    } else {
      // Create new
      await supabase.from("abandoned_checkouts").insert({
        session_id: sessionId,
        customer_name: sanitize(body.customerName || "", 100),
        customer_phone: sanitize(body.customerPhone || "", 20),
        customer_email: sanitize(body.customerEmail || "", 320),
        items: body.items || [],
        subtotal: Math.max(0, Number(body.subtotal) || 0),
        step_reached: sanitize(body.stepReached || "cart", 50),
        device_type: deviceType,
        browser,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// Mark checkout as recovered (when order completes)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionId = sanitize(body.sessionId || "", 100)
    if (!sessionId) return NextResponse.json({ success: true })

    const supabase = createClient()
    await supabase
      .from("abandoned_checkouts")
      .update({ recovered: true, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
