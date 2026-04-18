"use client"

import type { CartItem } from "./types"

const CART_KEY = "classy-collections-cart"
const SESSION_KEY = "kf_sid"
const LAST_STEP_KEY = "kf_last_abandon_step"

export type AbandonStep =
  | "cart"
  | "cart_left"
  | "checkout_started"
  | "payment_card"
  | "payment_card_failed"
  | "payment_mpesa_failed"
  | "payment_mpesa_cancelled"
  | "payment_mpesa_timeout"
  | "payment_insufficient_balance"

interface TrackOptions {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  reason?: string
  useBeacon?: boolean
  cart?: CartItem[]
  subtotal?: number
}

function readCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

/**
 * Send an abandonment ping for the current session.
 * Reads cart state from sessionStorage so it works from anywhere on the site.
 * Skips if there is no active cart (except for payment-failure steps, which we
 * always want to record — the cart may have just been cleared).
 */
export function trackAbandonment(step: AbandonStep, opts: TrackOptions = {}): void {
  if (typeof window === "undefined") return
  const sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) return

  const cart = opts.cart ?? readCart()
  const isPaymentStep = step.startsWith("payment_")
  if (cart.length === 0 && !isPaymentStep) return

  const subtotal =
    opts.subtotal ??
    cart.reduce(
      (sum, i) => sum + (Number(i.product?.price) || 0) * (Number(i.quantity) || 0),
      0,
    )

  const body = JSON.stringify({
    sessionId: sid,
    customerName: opts.customerName || "",
    customerPhone: opts.customerPhone || "",
    customerEmail: opts.customerEmail || "",
    items: cart.map((i) => ({
      name: i.product?.name,
      qty: i.quantity,
      price: i.product?.price,
      image: i.product?.images?.[0],
    })),
    subtotal,
    stepReached: step,
    reason: opts.reason || "",
  })

  try {
    sessionStorage.setItem(LAST_STEP_KEY, step)
  } catch {
    // ignore
  }

  if (opts.useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/track-abandoned", new Blob([body], { type: "application/json" }))
    return
  }

  fetch("/api/track-abandoned", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {})
}

export function getLastAbandonStep(): string {
  if (typeof window === "undefined") return ""
  try {
    return sessionStorage.getItem(LAST_STEP_KEY) || ""
  } catch {
    return ""
  }
}
