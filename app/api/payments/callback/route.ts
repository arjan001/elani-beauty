import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapCallbackToStatus } from "@/lib/payhero"
import { sendOrderConfirmationEmail } from "@/lib/email"

/**
 * PayHero → our server webhook.
 *
 * Endpoint: POST /api/payments/callback
 * Configure this URL in Netlify as PAYHERO_CALLBACK_URL (absolute https URL),
 * or leave it unset to let the helper derive it from NEXT_PUBLIC_APP_URL /
 * the Netlify-provided URL env var.
 *
 * PayHero posts a JSON body that may take one of these shapes:
 *   { status, reference, ExternalReference, CheckoutRequestID, ResultCode,
 *     ResultDesc, MpesaReceiptNumber, Phone, Amount, ... }
 *   { response: { ...same fields... } }
 *   { data:     { ...same fields... } }
 * We defensively read both flat and nested shapes.
 */
export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> = {}
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const body =
    pickObject(payload, "response") ||
    pickObject(payload, "data") ||
    pickObject(payload, "Body") ||
    payload

  const externalReference = String(
    getField(body, ["ExternalReference", "external_reference", "reference", "MerchantRequestID"]) ||
      getField(payload, ["ExternalReference", "external_reference", "reference", "MerchantRequestID"]) ||
      ""
  )
  const checkoutRequestId = String(
    getField(body, ["CheckoutRequestID", "checkout_request_id"]) ||
      getField(payload, ["CheckoutRequestID", "checkout_request_id"]) ||
      ""
  )
  const resultCode =
    getField(body, ["ResultCode", "result_code"]) ?? getField(payload, ["ResultCode", "result_code"])
  const resultDesc = String(
    getField(body, ["ResultDesc", "result_desc"]) || getField(payload, ["ResultDesc", "result_desc"]) || ""
  )
  const status = String(
    getField(body, ["Status", "status"]) || getField(payload, ["Status", "status"]) || ""
  )
  const mpesaReceipt = String(
    getField(body, ["MpesaReceiptNumber", "mpesa_receipt_number", "provider_reference"]) ||
      getField(payload, ["MpesaReceiptNumber", "mpesa_receipt_number", "provider_reference"]) ||
      ""
  )
  const phone = String(
    getField(body, ["Phone", "phone", "phone_number"]) ||
      getField(payload, ["Phone", "phone", "phone_number"]) ||
      ""
  )

  if (!externalReference && !checkoutRequestId) {
    console.warn("[payhero-callback] received callback with no reference / checkout id", payload)
    // Still 200 so PayHero doesn't retry forever.
    return NextResponse.json({ ok: true, ignored: true })
  }

  const mapped = mapCallbackToStatus(resultCode as number | string | undefined, status)

  const admin = createAdminClient()

  // Locate the order via external reference (preferred) or checkout id.
  const query = admin
    .from("orders")
    .select(
      "id, order_no, customer_name, customer_email, customer_phone, total, subtotal, delivery_fee, delivery_address, payment_status"
    )
    .limit(1)
  const lookup = externalReference
    ? await query.eq("payment_reference", externalReference).maybeSingle()
    : await query.eq("payment_checkout_id", checkoutRequestId).maybeSingle()

  if (lookup.error || !lookup.data) {
    console.warn("[payhero-callback] no matching order", { externalReference, checkoutRequestId, resultCode, status })
    // 200 so PayHero stops retrying — nothing actionable on our side.
    return NextResponse.json({ ok: true, matched: false })
  }

  const order = lookup.data

  // Don't overwrite a previously-successful payment from a late/retried callback.
  if (order.payment_status === "success" && mapped.paymentStatus !== "success") {
    return NextResponse.json({ ok: true, idempotent: true })
  }

  const update: Record<string, unknown> = {
    payment_status: mapped.paymentStatus,
    payment_result_desc: resultDesc || null,
    payment_updated_at: new Date().toISOString(),
    status: mapped.orderStatus,
  }
  if (mpesaReceipt) {
    update.payment_provider_reference = mpesaReceipt
    update.mpesa_code = mpesaReceipt
  }
  if (phone) update.mpesa_phone = phone
  if (checkoutRequestId) update.payment_checkout_id = checkoutRequestId

  const { error: updateError } = await admin.from("orders").update(update).eq("id", order.id)
  if (updateError) {
    console.error("[payhero-callback] db update error", updateError)
    return NextResponse.json({ ok: false, error: "db update failed" }, { status: 500 })
  }

  // On a genuine success transition, fire the confirmation email.
  if (mapped.paymentStatus === "success" && order.payment_status !== "success" && order.customer_email) {
    try {
      const { data: items } = await admin
        .from("order_items")
        .select("product_name, product_price, quantity, selected_variations")
        .eq("order_id", order.id)
      sendOrderConfirmationEmail({
        orderNumber: order.order_no,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        items: (items || []).map((it) => ({
          productName: it.product_name,
          quantity: it.quantity,
          unitPrice: Number(it.product_price) || 0,
          totalPrice: (Number(it.product_price) || 0) * (it.quantity || 1),
          variation: (it.selected_variations as { type?: string } | null)?.type,
        })),
        subtotal: Number(order.subtotal) || 0,
        deliveryFee: Number(order.delivery_fee) || 0,
        total: Number(order.total) || 0,
        deliveryAddress: order.delivery_address || "",
        paymentMethod: "mpesa",
        mpesaCode: mpesaReceipt || undefined,
      }).catch(() => {})
    } catch {
      // swallow — email is best-effort
    }
  }

  return NextResponse.json({ ok: true })
}

// PayHero sometimes probes callbacks with GET to verify reachability.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "payhero-callback" })
}

function getField(obj: Record<string, unknown> | null | undefined, keys: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined
  for (const k of keys) {
    if (k in obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k]
  }
  return undefined
}

function pickObject(obj: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const v = obj[key]
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>
  return null
}
