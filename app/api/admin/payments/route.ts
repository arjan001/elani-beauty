import { NextRequest, NextResponse } from "next/server"
import { requireAuth, rateLimit, rateLimitResponse } from "@/lib/security"

const LIPANA_API_BASE = "https://api.lipana.dev/v1"

function getLipanaKey(): string | null {
  return process.env.LIPANA_SECRET_KEY || null
}

// GET: Fetch transactions from Lipana
export async function GET(request: NextRequest) {
  const rl = rateLimit(request, { limit: 30, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const apiKey = getLipanaKey()
  if (!apiKey) {
    return NextResponse.json({ error: "Lipana API key not configured. Add LIPANA_SECRET_KEY to environment variables." }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "transactions"

  try {
    if (action === "transactions") {
      const status = searchParams.get("status") || ""
      const limit = searchParams.get("limit") || "50"
      const params = new URLSearchParams()
      if (status) params.set("status", status)
      params.set("limit", limit)

      const res = await fetch(`${LIPANA_API_BASE}/transactions?${params.toString()}`, {
        headers: { "x-api-key": apiKey },
      })
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === "payment-links") {
      const res = await fetch(`${LIPANA_API_BASE}/payment-links`, {
        headers: { "x-api-key": apiKey },
      })
      const data = await res.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Lipana API error:", error)
    return NextResponse.json({ error: "Failed to fetch from Lipana API" }, { status: 500 })
  }
}

// POST: Create payment links or initiate STK push
export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 15, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const apiKey = getLipanaKey()
  if (!apiKey) {
    return NextResponse.json({ error: "Lipana API key not configured. Add LIPANA_SECRET_KEY to environment variables." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { action, ...payload } = body

    if (action === "create-payment-link") {
      const res = await fetch(`${LIPANA_API_BASE}/payment-links`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json(data, { status: res.status })
      return NextResponse.json(data)
    }

    if (action === "stk-push") {
      const res = await fetch(`${LIPANA_API_BASE}/transactions/push-stk`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: payload.phone,
          amount: payload.amount,
        }),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json(data, { status: res.status })
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Lipana API error:", error)
    return NextResponse.json({ error: "Failed to process Lipana request" }, { status: 500 })
  }
}
