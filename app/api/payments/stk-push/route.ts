import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/supabase-data"
import { createAdminClient } from "@/lib/supabase/admin"
import { rateLimit, rateLimitResponse, sanitize, isValidPhone, isValidEmail } from "@/lib/security"
import { initiateStkPush, isPayHeroConfigured, normalizePhone, callbackUrl } from "@/lib/payhero"

/**
 * Create a pending order and initiate a PayHero M-Pesa STK push to the customer.
 * The order is saved immediately with payment_status='pending'. The PayHero
 * webhook (/api/payments/callback) will update the order when the customer
 * completes, cancels, or fails the payment.
 */
export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 6, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()

  if (!isPayHeroConfigured()) {
    return NextResponse.json({ error: "M-Pesa payments are not configured yet. Please try another payment method." }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Validate the checkout payload (same shape as /api/orders)
  const customerName = sanitize(body.customerName, 100)
  const customerEmail = body.customerEmail ? sanitize(body.customerEmail, 320) : ""
  const customerPhone = sanitize(body.customerPhone, 20)
  const deliveryAddress = sanitize(body.deliveryAddress, 500)
  const notes = sanitize(body.notes, 1000)
  const mpesaPhone = sanitize((body.mpesaPhone as string) || (body.customerPhone as string), 20)

  if (!customerName || !customerPhone || !deliveryAddress || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!isValidPhone(customerPhone) || !isValidPhone(mpesaPhone)) {
    return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
  }
  if (customerEmail && !isValidEmail(customerEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  const subtotal = Math.max(0, Number(body.subtotal) || 0)
  const deliveryFee = Math.max(0, Number(body.deliveryFee) || 0)
  const total = Math.max(1, Math.round(Number(body.total) || 0))
  if (total < 1) return NextResponse.json({ error: "Amount must be at least KSh 1" }, { status: 400 })

  const items = (body.items as Record<string, unknown>[]).slice(0, 50).map((item) => ({
    productId: sanitize(String(item.productId || ""), 50),
    productName: sanitize(String(item.productName || item.name || ""), 200),
    productImage: item.productImage || item.image ? sanitize(String(item.productImage || item.image || ""), 500) : undefined,
    variation: item.variation ? sanitize(String(item.variation), 100) : undefined,
    quantity: Math.min(100, Math.max(1, Math.floor(Number(item.quantity) || 1))),
    unitPrice: Math.max(0, Number(item.unitPrice || item.price) || 0),
    totalPrice: Math.max(0, Number(item.totalPrice || (Number(item.unitPrice || item.price) || 0) * (Number(item.quantity) || 1))),
  }))

  // Create the pending order first so the reference (order_no) is stable.
  let created: { orderNumber: string; orderId: string }
  try {
    created = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      deliveryLocationId: body.deliveryLocationId as string | undefined,
      deliveryAddress,
      deliveryFee,
      subtotal,
      total,
      notes,
      orderedVia: "website",
      paymentMethod: "mpesa",
      paymentStatus: "pending",
      paymentReference: undefined, // set below
      mpesaPhone: normalizePhone(mpesaPhone),
      items,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[stk-push] Failed to create pending order:", msg)
    return NextResponse.json({
      error: "Could not save your order. Please try again in a moment.",
      detail: msg,
    }, { status: 500 })
  }

  // Kick off the STK push with the order_no as external_reference.
  const stk = await initiateStkPush({
    amount: total,
    phone: normalizePhone(mpesaPhone),
    externalReference: created.orderNumber,
    customerName,
    callbackUrl: callbackUrl(request),
  })

  // Persist the PayHero reference & checkout id back to the order regardless of outcome.
  try {
    const supabase = createAdminClient()
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_reference: created.orderNumber,
        payment_checkout_id: stk.checkoutRequestId || null,
        payment_status: stk.success ? "pending" : "failed",
        payment_result_desc: stk.success ? null : stk.error || "STK push failed to initiate",
        payment_updated_at: new Date().toISOString(),
        status: stk.success ? "pending" : "cancelled",
      })
      .eq("id", created.orderId)
    if (updateError) {
      console.error("[stk-push] Failed to update order with payment reference:", updateError.message)
    }
  } catch (err) {
    console.error("[stk-push] Exception updating order with payment reference:", err)
  }

  if (!stk.success) {
    return NextResponse.json({
      error: stk.error || "Failed to send M-Pesa prompt. Please try again.",
      orderNumber: created.orderNumber,
    }, { status: 502 })
  }

  return NextResponse.json({
    success: true,
    orderNumber: created.orderNumber,
    orderId: created.orderId,
    reference: created.orderNumber,
    checkoutRequestId: stk.checkoutRequestId || null,
    status: stk.status || "QUEUED",
  })
}
