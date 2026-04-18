"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2, Phone, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Stage = "input" | "waiting" | "success" | "failed" | "cancelled" | "timeout" | "insufficient_balance"

interface MpesaPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  defaultPhone?: string
  buildPayload: (mpesaPhone: string) => Record<string, unknown>
  onPaymentSuccess: (info: { orderNumber: string; mpesaReceipt?: string; mpesaPhone: string }) => void
}

export function MpesaPaymentModal({ isOpen, onClose, total, defaultPhone, buildPayload, onPaymentSuccess }: MpesaPaymentModalProps) {
  const [stage, setStage] = useState<Stage>("input")
  const [phone, setPhone] = useState(defaultPhone || "")
  const [error, setError] = useState("")
  const [resultDesc, setResultDesc] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [mpesaReceipt, setMpesaReceipt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStage("input")
      setError("")
      setResultDesc("")
      setOrderNumber("")
      setMpesaReceipt("")
      setIsSubmitting(false)
      if (defaultPhone) setPhone(defaultPhone)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen, defaultPhone])

  if (!isOpen) return null

  const cleanPhone = phone.replace(/[\s\-()]/g, "")
  const isPhoneValid = /^(\+?254[17]\d{8}|0[17]\d{8})$/.test(cleanPhone)

  const formatKenyanPhone = (p: string) => {
    const raw = p.replace(/[\s\-()+]/g, "")
    if (raw.startsWith("254")) return raw
    if (raw.startsWith("0")) return "254" + raw.slice(1)
    if (/^[17]\d{8}$/.test(raw)) return "254" + raw
    return raw
  }

  const startPolling = (reference: string) => {
    const deadline = Date.now() + 90_000 // 90s timeout
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?reference=${encodeURIComponent(reference)}`)
        const data = await res.json()
        if (data.status === "success") {
          clearTimers()
          setMpesaReceipt(data.providerReference || "")
          setStage("success")
          // Wait briefly so the user sees confirmation, then fire callback
          setTimeout(() => {
            onPaymentSuccess({
              orderNumber: reference,
              mpesaReceipt: data.providerReference || undefined,
              mpesaPhone: formatKenyanPhone(phone),
            })
          }, 1200)
          return
        }
        if (["failed", "cancelled", "timeout", "insufficient_balance"].includes(data.status)) {
          clearTimers()
          setResultDesc(data.resultDesc || "")
          setStage(data.status as Stage)
          return
        }
      } catch {
        // Network error — keep polling until deadline.
      }
      if (Date.now() > deadline) {
        clearTimers()
        setStage("timeout")
      }
    }, 3000)

    timeoutRef.current = setTimeout(() => {
      clearTimers()
      setStage((s) => (s === "waiting" ? "timeout" : s))
    }, 92_000)
  }

  const clearTimers = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
  }

  const handleSubmit = async () => {
    setError("")
    if (!isPhoneValid) {
      setError("Enter a valid Safaricom number (07XX or 01XX).")
      return
    }
    setIsSubmitting(true)
    try {
      const payload = buildPayload(formatKenyanPhone(phone))
      const res = await fetch("/api/payments/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, mpesaPhone: formatKenyanPhone(phone) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not send M-Pesa prompt. Please try again.")
        setIsSubmitting(false)
        return
      }
      setOrderNumber(data.orderNumber)
      setStage("waiting")
      setIsSubmitting(false)
      startPolling(data.reference || data.orderNumber)
    } catch {
      setError("Network error. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    clearTimers()
    onClose()
  }

  const handleRetry = () => {
    setStage("input")
    setError("")
    setResultDesc("")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={stage === "waiting" ? undefined : handleClose} />

      <div className="relative bg-background w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {stage !== "waiting" && (
          <button type="button" onClick={handleClose} className="absolute top-3 right-3 z-20 p-1.5 hover:bg-secondary rounded-sm transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="bg-[#00843D] px-6 pt-8 pb-6 text-center relative overflow-hidden">
          <div className="absolute right-6 top-4 opacity-20">
            <svg width="48" height="72" viewBox="0 0 48 72" fill="white">
              <rect x="6" y="0" width="36" height="72" rx="6" stroke="white" strokeWidth="2" fill="none" />
              <rect x="14" y="6" width="20" height="48" rx="1" fill="white" opacity="0.3" />
              <circle cx="24" cy="62" r="4" fill="white" opacity="0.4" />
            </svg>
          </div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight">LIPA NA M-PESA</h2>
          <div className="flex justify-center mt-1">
            <div className="w-16 h-1 bg-[#E4002B] rounded-full" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="bg-[#00843D]/5 border border-[#00843D]/15 rounded-sm p-4 flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-muted-foreground">Amount to Pay:</span>
            <span className="text-xl font-bold text-[#00843D]">{formatPrice(total)}</span>
          </div>

          {stage === "input" && (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">M-PESA Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError("") }}
                      placeholder="0712 345 678"
                      className={`h-11 pl-10 ${phone && !isPhoneValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      type="tel"
                      inputMode="tel"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Safaricom number in 07XX, 01XX, +254 or 254 format</p>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Amount (KSh)</Label>
                  <Input value={formatPrice(total)} readOnly className="h-11 bg-secondary/40 font-semibold" />
                  <p className="text-[11px] text-muted-foreground mt-1">You will receive an M-PESA prompt for this amount.</p>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-sm">{error}</div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!isPhoneValid || isSubmitting}
                className="w-full h-12 mt-5 bg-[#00843D] text-white hover:bg-[#006B32] text-sm font-semibold disabled:opacity-40"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                ) : (
                  <>Send M-PESA Prompt</>
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
                You&apos;ll receive a pop-up on your phone. Enter your M-PESA PIN to complete the payment.
              </p>
            </>
          )}

          {stage === "waiting" && (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#00843D] mb-4" />
              <p className="text-base font-semibold mb-1">Check your phone</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                We sent an M-PESA prompt to <span className="font-semibold text-foreground">{formatKenyanPhone(phone)}</span>. Enter your PIN to approve <span className="font-semibold text-foreground">{formatPrice(total)}</span>.
              </p>
              {orderNumber && (
                <p className="text-xs text-muted-foreground mt-3">Order Ref: <span className="font-mono font-medium">{orderNumber}</span></p>
              )}
              <p className="text-[11px] text-muted-foreground mt-4">Waiting for confirmation... This usually takes under a minute.</p>
            </div>
          )}

          {stage === "success" && (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-14 w-14 mx-auto text-[#00843D] mb-3" />
              <p className="text-lg font-bold text-[#00843D] mb-1">Payment Received</p>
              {mpesaReceipt && (
                <p className="text-xs text-muted-foreground">M-PESA Ref: <span className="font-mono font-medium text-foreground">{mpesaReceipt}</span></p>
              )}
              <p className="text-sm text-muted-foreground mt-2">Your order is confirmed. One moment...</p>
            </div>
          )}

          {(stage === "cancelled" || stage === "failed") && (
            <div className="py-6 text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-600 mb-3" />
              <p className="text-base font-semibold mb-1">{stage === "cancelled" ? "Payment Cancelled" : "Payment Failed"}</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {stage === "cancelled"
                  ? "The M-PESA request was cancelled on your phone."
                  : resultDesc || "The payment did not go through."}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full h-11 bg-[#00843D] hover:bg-[#006B32] text-white">Try Again</Button>
                <Button variant="outline" onClick={handleClose} className="w-full h-11">Close</Button>
              </div>
            </div>
          )}

          {stage === "insufficient_balance" && (
            <div className="py-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-3" />
              <p className="text-base font-semibold mb-1">Insufficient M-PESA Balance</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Top up your M-PESA and try again, or choose another payment method.</p>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full h-11 bg-[#00843D] hover:bg-[#006B32] text-white">Try Again</Button>
                <Button variant="outline" onClick={handleClose} className="w-full h-11">Close</Button>
              </div>
            </div>
          )}

          {stage === "timeout" && (
            <div className="py-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-3" />
              <p className="text-base font-semibold mb-1">Payment Timed Out</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">We didn&apos;t receive a confirmation in time. The prompt may have expired on your phone.</p>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full h-11 bg-[#00843D] hover:bg-[#006B32] text-white">Try Again</Button>
                <Button variant="outline" onClick={handleClose} className="w-full h-11">Close</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
