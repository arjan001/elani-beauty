import { NextRequest, NextResponse } from "next/server"
import { requireAuth, rateLimit, rateLimitResponse } from "@/lib/security"
import { createClient } from "@/lib/supabase/server"
import { initiateStkPush, isPayHeroConfigured, callbackUrl, normalizePhone, fetchWalletBalance } from "@/lib/payhero"

// GET: Fetch M-Pesa orders (PayHero-initiated) or card orders from our DB.
export async function GET(request: NextRequest) {
  const rl = rateLimit(request, { limit: 30, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "transactions"

  // Balances are read straight from PayHero — no DB access required, and we
  // want to surface the real upstream error rather than masking it.
  if (action === "balances") {
    if (!isPayHeroConfigured()) {
      return NextResponse.json(
        {
          error: "PayHero is not configured. Set PAYHERO_API_USERNAME, PAYHERO_API_PASSWORD and PAYHERO_CHANNEL_ID.",
        },
        { status: 500 },
      )
    }
    const [service, payment, subscription] = await Promise.all([
      fetchWalletBalance("service_wallet"),
      fetchWalletBalance("payment_wallet"),
      fetchWalletBalance("subscription_wallet"),
    ])
    return NextResponse.json({
      service: {
        label: "Service Wallet (STK Push Credits)",
        balance: service.success ? service.balance ?? null : null,
        currency: service.currency || "KES",
        error: service.success ? null : service.error || "Failed to fetch service wallet",
      },
      payment: {
        label: "Payments Wallet (Customer Funds)",
        balance: payment.success ? payment.balance ?? null : null,
        currency: payment.currency || "KES",
        error: payment.success ? null : payment.error || "Failed to fetch payments wallet",
      },
      subscription: {
        label: "Subscription Wallet",
        balance: subscription.success ? subscription.balance ?? null : null,
        currency: subscription.currency || "KES",
        error: subscription.success ? null : subscription.error || "Not available for this PayHero account",
      },
    })
  }

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: "Database not available" }, { status: 500 })

  if (action === "card-payments") {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_no, customer_name, customer_phone, customer_email, subtotal, delivery_fee, total, status, payment_method, order_notes, created_at")
      .eq("payment_method", "card")
      .order("created_at", { ascending: false })
      .limit(100)
    if (error) return NextResponse.json({ error: "Failed to fetch card payments" }, { status: 500 })
    return NextResponse.json(data || [])
  }

  // transactions = M-Pesa orders processed via PayHero (plus legacy mpesa orders)
  if (action === "transactions") {
    const statusFilter = searchParams.get("status") || ""
    let query = supabase
      .from("orders")
      .select("id, order_no, customer_name, customer_phone, total, status, payment_method, payment_status, payment_reference, payment_checkout_id, payment_provider_reference, payment_result_desc, payment_updated_at, mpesa_code, mpesa_phone, created_at")
      .eq("payment_method", "mpesa")
      .order("created_at", { ascending: false })
      .limit(100)
    if (statusFilter) query = query.eq("payment_status", statusFilter)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: "Failed to fetch M-Pesa orders" }, { status: 500 })

    const rows = (data || []).map((o) => ({
      id: o.id,
      orderNo: o.order_no,
      customer: o.customer_name,
      phone: o.mpesa_phone || o.customer_phone,
      amount: Number(o.total) || 0,
      status: o.payment_status || "pending",
      orderStatus: o.status,
      reference: o.payment_reference || o.order_no,
      checkoutRequestId: o.payment_checkout_id || null,
      providerReference: o.payment_provider_reference || o.mpesa_code || null,
      resultDesc: o.payment_result_desc || null,
      createdAt: o.created_at,
      updatedAt: o.payment_updated_at,
    }))
    return NextResponse.json(rows)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

// POST: Admin can trigger an STK push to a customer's phone.
export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 15, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  if (!isPayHeroConfigured()) {
    return NextResponse.json({ error: "PayHero is not configured. Set PAYHERO_API_USERNAME, PAYHERO_API_PASSWORD and PAYHERO_CHANNEL_ID." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { action } = body

    if (action === "stk-push") {
      const amount = Number(body.amount)
      if (!body.phone || !amount || amount < 1) {
        return NextResponse.json({ error: "Phone and amount are required" }, { status: 400 })
      }
      const resolvedCallbackUrl = callbackUrl(request)
      if (!/^https:\/\//i.test(resolvedCallbackUrl)) {
        return NextResponse.json({
          error: "Payment callback URL is not configured. Set PAYHERO_CALLBACK_URL (or NEXT_PUBLIC_APP_URL) to your public https URL.",
        }, { status: 500 })
      }
      const reference = `ADMIN-${Date.now().toString(36).toUpperCase()}`
      const result = await initiateStkPush({
        amount,
        phone: normalizePhone(String(body.phone)),
        externalReference: reference,
        customerName: body.customerName || "Admin Request",
        callbackUrl: resolvedCallbackUrl,
      })
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to initiate STK push" }, { status: 502 })
      }
      return NextResponse.json({
        success: true,
        reference: result.reference || reference,
        checkoutRequestId: result.checkoutRequestId,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("PayHero admin error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
