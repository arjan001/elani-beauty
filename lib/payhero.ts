/**
 * PayHero M-Pesa STK Push integration helpers.
 * Docs: https://docs.payhero.co.ke/
 *
 * This project uses PayHero exclusively for M-Pesa payments — no direct
 * Safaricom Daraja integration. All credentials come from env vars.
 *
 * Required env vars:
 *   - PAYHERO_API_USERNAME + PAYHERO_API_PASSWORD  (or)
 *     PAYHERO_AUTH_TOKEN / PAYHERO_BASIC_AUTH_TOKEN  (pre-built Basic token)
 *   - PAYHERO_CHANNEL_ID  (numeric id from PayHero dashboard)
 *
 * Optional env vars:
 *   - PAYHERO_CALLBACK_URL  (absolute public URL, overrides all fallbacks)
 *   - NEXT_PUBLIC_APP_URL   (site origin used as fallback for callback URL)
 *   - URL / DEPLOY_URL / DEPLOY_PRIME_URL / SITE_URL  (auto-set by Netlify —
 *     used as final fallback so deploy previews & prod always have a working
 *     callback URL even when PAYHERO_CALLBACK_URL is not set).
 */

const PAYHERO_BASE = "https://backend.payhero.co.ke/api/v2"
const CALLBACK_PATH = "/api/payments/callback"

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
  return Boolean(getBasicAuth()) && Boolean(getChannelId())
}

function getBasicAuth(): string | null {
  const prebuilt = process.env.PAYHERO_AUTH_TOKEN || process.env.PAYHERO_BASIC_AUTH_TOKEN
  if (prebuilt && prebuilt.trim()) {
    const v = prebuilt.trim()
    return v.startsWith("Basic ") ? v : `Basic ${v}`
  }
  const username = process.env.PAYHERO_API_USERNAME
  const password = process.env.PAYHERO_API_PASSWORD
  if (!username || !password) return null
  const token = Buffer.from(`${username}:${password}`).toString("base64")
  return `Basic ${token}`
}

function getChannelId(): number | null {
  const raw = process.env.PAYHERO_CHANNEL_ID
  if (!raw) return null
  const n = Number(String(raw).trim())
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

/** Normalize to Safaricom 2547XXXXXXXX / 2541XXXXXXXX format accepted by PayHero. */
export function normalizePhone(input: string): string {
  let p = String(input || "").replace(/[\s+()-]/g, "")
  if (p.startsWith("254")) return p
  if (p.startsWith("0")) return "254" + p.slice(1)
  if (/^[17]\d{8}$/.test(p)) return "254" + p
  return p
}

export async function initiateStkPush(input: PayHeroStkPushInput): Promise<PayHeroStkPushResponse> {
  const auth = getBasicAuth()
  const channelId = getChannelId()
  if (!auth) {
    return {
      success: false,
      error:
        "PayHero is not configured. Set PAYHERO_API_USERNAME and PAYHERO_API_PASSWORD (or PAYHERO_BASIC_AUTH_TOKEN) in your environment.",
    }
  }
  if (!channelId) {
    return {
      success: false,
      error:
        "PayHero channel is not configured. Set PAYHERO_CHANNEL_ID to the numeric channel id from your PayHero dashboard.",
    }
  }
  if (!input.callbackUrl || !/^https?:\/\//i.test(input.callbackUrl)) {
    return {
      success: false,
      error:
        "PayHero callback URL is not an absolute URL. Set PAYHERO_CALLBACK_URL to an https URL pointing to /api/payments/callback.",
    }
  }

  const body = {
    amount: Math.round(input.amount),
    phone_number: normalizePhone(input.phone),
    channel_id: channelId,
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
        Accept: "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const d = data as Record<string, unknown>
      const apiMessage =
        (d?.error_message as string) ||
        (d?.message as string) ||
        (d?.error as string) ||
        (typeof d?.errors === "string" ? (d.errors as string) : "")
      const friendly =
        res.status === 401 || res.status === 403
          ? "PayHero rejected the request credentials. Verify PAYHERO_API_USERNAME / PAYHERO_API_PASSWORD (or PAYHERO_BASIC_AUTH_TOKEN)."
          : res.status === 400 && apiMessage
            ? `PayHero rejected the request: ${apiMessage}`
            : apiMessage || `PayHero returned HTTP ${res.status}`
      console.error("[payhero] STK push failed", {
        status: res.status,
        response: data,
        payload: { ...body, phone_number: "<redacted>" },
      })
      return { success: false, error: friendly, raw: data }
    }
    const d = data as Record<string, unknown>
    const nested = (d.response as Record<string, unknown> | undefined) || (d.data as Record<string, unknown> | undefined) || {}
    return {
      success: true,
      status: (d.status as string) || (nested.status as string) || "QUEUED",
      reference:
        (d.reference as string) ||
        (d.merchant_reference as string) ||
        (nested.reference as string) ||
        (nested.merchant_reference as string),
      checkoutRequestId:
        (d.CheckoutRequestID as string) ||
        (d.checkout_request_id as string) ||
        (nested.CheckoutRequestID as string) ||
        (nested.checkout_request_id as string),
      raw: data,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error calling PayHero"
    console.error("[payhero] Network error reaching PayHero", err)
    return { success: false, error: msg }
  }
}

export async function fetchTransactionStatus(reference: string): Promise<PayHeroStatusResponse> {
  const auth = getBasicAuth()
  if (!auth) return { success: false, error: "PayHero is not configured." }
  try {
    const res = await fetch(`${PAYHERO_BASE}/transaction-status?reference=${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: auth, Accept: "application/json" },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { success: false, error: `PayHero returned HTTP ${res.status}`, raw: data }
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

export interface PayHeroWalletResponse {
  success: boolean
  balance?: number
  currency?: string
  error?: string
  raw?: unknown
}

/**
 * Fetch a PayHero wallet balance.
 *
 * PayHero exposes balances via `GET /api/v2/wallets?wallet_type=<type>`.
 * Known wallet types:
 *   - `service_wallet`     - credits used to pay STK push fees ("account balance")
 *   - `payment_wallet`     - funds collected from customers awaiting withdrawal
 *   - `subscription_wallet`- subscription/credit balance (may not be enabled for
 *     every merchant; the helper surfaces the upstream message instead of
 *     throwing if the type is unsupported)
 *
 * The response JSON shape varies between merchants, so we probe several
 * common field names for the balance before giving up.
 */
export async function fetchWalletBalance(walletType: string): Promise<PayHeroWalletResponse> {
  const auth = getBasicAuth()
  if (!auth) return { success: false, error: "PayHero is not configured." }
  try {
    const res = await fetch(`${PAYHERO_BASE}/wallets?wallet_type=${encodeURIComponent(walletType)}`, {
      method: "GET",
      headers: { Authorization: auth, Accept: "application/json" },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const d = data as Record<string, unknown>
      const msg =
        (d?.error_message as string) ||
        (d?.message as string) ||
        (d?.error as string) ||
        `PayHero returned HTTP ${res.status}`
      return { success: false, error: msg, raw: data }
    }
    const d = data as Record<string, unknown>
    const nested =
      (d.wallet as Record<string, unknown> | undefined) ||
      (d.data as Record<string, unknown> | undefined) ||
      (d.response as Record<string, unknown> | undefined) ||
      {}
    const rawBalance =
      d.balance ??
      d.available_balance ??
      d.wallet_balance ??
      nested.balance ??
      nested.available_balance ??
      nested.wallet_balance
    const balance = rawBalance === undefined || rawBalance === null ? undefined : Number(rawBalance)
    const currency =
      (d.currency as string) ||
      (nested.currency as string) ||
      "KES"
    return {
      success: true,
      balance: Number.isFinite(balance as number) ? (balance as number) : undefined,
      currency,
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

/**
 * Produce the absolute callback URL PayHero should POST to after the
 * customer acts on the STK prompt.
 *
 * Resolution order:
 *   1. PAYHERO_CALLBACK_URL (explicit override, highest trust)
 *   2. NEXT_PUBLIC_APP_URL  (public site origin)
 *   3. SITE_URL / URL / DEPLOY_URL / DEPLOY_PRIME_URL (Netlify build-time vars)
 *   4. Request origin (only works when the request came through the public URL)
 *
 * PayHero requires an absolute https URL. Localhost URLs are rejected upstream
 * and will never receive the callback, so this helper skips any http://localhost
 * candidate when picking a fallback.
 */
export function callbackUrl(request: Request): string {
  const candidates: (string | undefined)[] = [
    process.env.PAYHERO_CALLBACK_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_URL,
    process.env.DEPLOY_PRIME_URL,
  ]
  for (const c of candidates) {
    const resolved = toCallbackUrl(c)
    if (resolved) return resolved
  }
  try {
    const u = new URL(request.url)
    if (u.hostname && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
      return `${u.origin}${CALLBACK_PATH}`
    }
  } catch {
    // fall through
  }
  // Last resort: return a relative path. PayHero will reject it, but we
  // surface a clear error upstream rather than silently sending the wrong URL.
  return CALLBACK_PATH
}

function toCallbackUrl(raw: string | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  // If it already looks like a full callback URL, use it as-is.
  if (/^https?:\/\/.+\/api\/payments\/callback\/?(\?.*)?$/i.test(trimmed)) {
    return trimmed.replace(/\/$/, "")
  }
  // Otherwise treat it as a site origin and append the callback path.
  if (/^https?:\/\//i.test(trimmed)) {
    const origin = trimmed.replace(/\/$/, "")
    if (/localhost|127\.0\.0\.1/i.test(origin)) return null
    return `${origin}${CALLBACK_PATH}`
  }
  return null
}
