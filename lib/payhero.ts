/**
 * PayHero M-Pesa STK Push integration helpers.
 * Docs: https://docs.payhero.co.ke/
 *
 * Auth: Basic token = base64("<API_USERNAME>:<API_PASSWORD>")
 *       OR a pre-built token copied from the PayHero dashboard.
 */

const PAYHERO_BASE = "https://backend.payhero.co.ke/api/v2"

export interface PayHeroStkPushInput {
  amount: number
  phone: string
  externalReference: string
  customerName: string
  callbackUrl: string
}

export interface PayHeroStkPushResponse {
  success: boolean
  status?: string
  reference?: string
  checkoutRequestId?: string
  raw?: unknown
  error?: string
}

export interface PayHeroStatusResponse {
  success: boolean
  status?: string
  providerReference?: string
  raw?: unknown
  error?: string
}

export function isPayHeroConfigured(): boolean {
  return Boolean(getBasicAuth()) && Boolean(process.env.PAYHERO_CHANNEL_ID)
}

function getBasicAuth(): string | null {
  const prebuilt = process.env.PAYHERO_AUTH_TOKEN
  if (prebuilt) {
    return prebuilt.startsWith("Basic ") ? prebuilt : `Basic ${prebuilt}`
  }
  const username = process.env.PAYHERO_API_USERNAME
  const password = process.env.PAYHERO_API_PASSWORD
  if (!username || !password) return null
  const token = Buffer.from(`${username}:${password}`).toString("base64")
  return `Basic ${token}`
}

/** Normalize to Safaricom 2547XXXXXXXX format accepted by PayHero. */
export function normalizePhone(input: string): string {
  let p = String(input || "").replace(/[\s+()-]/g, "")
  if (p.startsWith("254")) return p
  if (p.startsWith("0")) return "254" + p.slice(1)
  if (/^[17]\d{8}$/.test(p)) return "254" + p
  return p
}

export async function initiateStkPush(input: PayHeroStkPushInput): Promise<PayHeroStkPushResponse> {
  const auth = getBasicAuth()
  const channelId = process.env.PAYHERO_CHANNEL_ID
  if (!auth || !channelId) {
    return { success: false, error: "PayHero is not configured. Set PAYHERO_API_USERNAME, PAYHERO_API_PASSWORD and PAYHERO_CHANNEL_ID." }
  }

  const body = {
    amount: Math.round(input.amount),
    phone_number: normalizePhone(input.phone),
    channel_id: Number(channelId),
    provider: "m-pesa",
    external_reference: input.externalReference,
    customer_name: input.customerName,
    callback_url: input.callbackUrl,
  }

  try {
    const res = await fetch(`${PAYHERO_BASE}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        success: false,
        error: (data as Record<string, unknown>)?.error_message as string
          || (data as Record<string, unknown>)?.message as string
          || `PayHero returned ${res.status}`,
        raw: data,
      }
    }
    const d = data as Record<string, unknown>
    return {
      success: true,
      status: (d.status as string) || "QUEUED",
      reference: (d.reference as string) || (d.merchant_reference as string),
      checkoutRequestId: (d.CheckoutRequestID as string) || (d.checkout_request_id as string),
      raw: data,
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error calling PayHero" }
  }
}

export async function fetchTransactionStatus(reference: string): Promise<PayHeroStatusResponse> {
  const auth = getBasicAuth()
  if (!auth) return { success: false, error: "PayHero is not configured." }
  try {
    const res = await fetch(`${PAYHERO_BASE}/transaction-status?reference=${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: auth },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { success: false, error: `PayHero returned ${res.status}`, raw: data }
    }
    const d = data as Record<string, unknown>
    return {
      success: true,
      status: (d.status as string) || undefined,
      providerReference: (d.provider_reference as string) || undefined,
      raw: data,
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error calling PayHero" }
  }
}

/**
 * Map a PayHero callback ResultCode / status into our internal payment_status.
 * Reference: Safaricom STK ResultCodes.
 *   0    -> success
 *   1    -> insufficient_balance
 *   1032 -> cancelled (user cancelled)
 *   1037 -> timeout (user didn't respond)
 *   2001 -> failed (wrong PIN)
 *   else -> failed
 */
export function mapCallbackToStatus(resultCode: number | string | undefined, status: string | undefined): {
  paymentStatus: "success" | "failed" | "cancelled" | "timeout" | "insufficient_balance"
  orderStatus: "confirmed" | "pending" | "cancelled"
} {
  const code = resultCode === undefined || resultCode === null ? NaN : Number(resultCode)
  const sUpper = String(status || "").toUpperCase()

  if (code === 0 || sUpper === "SUCCESS") {
    return { paymentStatus: "success", orderStatus: "confirmed" }
  }
  if (code === 1) return { paymentStatus: "insufficient_balance", orderStatus: "cancelled" }
  if (code === 1032) return { paymentStatus: "cancelled", orderStatus: "cancelled" }
  if (code === 1037) return { paymentStatus: "timeout", orderStatus: "cancelled" }
  return { paymentStatus: "failed", orderStatus: "cancelled" }
}

export function callbackUrl(request: Request): string {
  const envUrl = process.env.PAYHERO_CALLBACK_URL
  if (envUrl) return envUrl
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) return `${appUrl.replace(/\/$/, "")}/api/payments/callback`
  try {
    const u = new URL(request.url)
    return `${u.origin}/api/payments/callback`
  } catch {
    return "/api/payments/callback"
  }
}
