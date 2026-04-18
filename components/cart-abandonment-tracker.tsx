"use client"

import { useEffect, useRef } from "react"
import { useCart } from "@/lib/cart-context"
import { trackAbandonment } from "@/lib/abandonment-tracker"

/**
 * Mounted once at the app root. Records a server-side snapshot of the shopper's
 * cart whenever it changes and again if they hide/close the tab with items in
 * it. This is what powers the "Recent Abandoned Checkouts" admin view for
 * shoppers who added items but never started checkout.
 */
export function CartAbandonmentTracker() {
  const { items, totalPrice } = useCart()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSnapshotRef = useRef<string>("")

  // Debounced server sync on cart changes
  useEffect(() => {
    if (typeof window === "undefined") return
    if (items.length === 0) return

    const signature = `${items.length}|${totalPrice}|${items
      .map((i) => `${i.product.id}:${i.quantity}`)
      .join(",")}`
    if (signature === lastSnapshotRef.current) return
    lastSnapshotRef.current = signature

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      trackAbandonment("cart", { cart: items, subtotal: totalPrice })
    }, 2000)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [items, totalPrice])

  // Fire one final ping when the shopper hides/closes the tab with items left
  useEffect(() => {
    if (typeof window === "undefined") return

    const onHide = () => {
      if (items.length === 0) return
      trackAbandonment("cart_left", {
        cart: items,
        subtotal: totalPrice,
        useBeacon: true,
      })
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide()
    }

    window.addEventListener("pagehide", onHide)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("pagehide", onHide)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [items, totalPrice])

  return null
}
