import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { rateLimit, rateLimitResponse } from "@/lib/security"

/**
 * Public polling endpoint the M-Pesa modal hits every few seconds while
 * waiting for the customer to enter their PIN on their phone.
 *
 * Returns the current payment_status from the DB, which is kept fresh by
 * the PayHero webhook at /api/payments/callback.
 */
export async function GET(request: NextRequest) {
  const rl = rateLimit(request, { limit: 120, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  const { searchParams } = new URL(request.url)
  const reference = (searchParams.get("reference") || "").trim()
  if (!reference) return NextResponse.json({ error: "reference is required" }, { status: 400 })
  if (reference.length > 64) return NextResponse.json({ error: "invalid reference" }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("orders")
    .select("order_no, total, payment_status, payment_provider_reference, payment_result_desc, payment_updated_at, status")
    .eq("payment_reference", reference)
    .maybeSingle()

  if (error) return NextResponse.json({ error: "Lookup failed" }, { status: 500 })
  if (!data) return NextResponse.json({ status: "unknown" }, { status: 404 })

  return NextResponse.json({
    orderNumber: data.order_no,
    amount: Number(data.total) || 0,
    status: data.payment_status || "pending",
    orderStatus: data.status,
    providerReference: data.payment_provider_reference || null,
    resultDesc: data.payment_result_desc || null,
    updatedAt: data.payment_updated_at,
  })
}
