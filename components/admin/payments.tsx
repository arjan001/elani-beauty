"use client"

import { useState } from "react"
import { AdminShell } from "./admin-shell"
import useSWR, { mutate } from "swr"
import { toast } from "sonner"
import {
  CreditCard,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  AlertCircle,
  Wallet,
  PiggyBank,
  Banknote,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface MpesaTransaction {
  id: string
  orderNo: string
  customer: string
  phone: string
  amount: number
  status: string
  orderStatus: string
  reference: string
  checkoutRequestId: string | null
  providerReference: string | null
  resultDesc: string | null
  createdAt: string
  updatedAt: string | null
}

interface CardPaymentOrder {
  id: string
  order_no: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  subtotal: number
  delivery_fee: number
  total: number
  status: string
  payment_method: string
  order_notes?: string
  created_at: string
}

interface WalletBalance {
  label: string
  balance: number | null
  currency: string
  error: string | null
}

interface PayHeroBalances {
  service: WalletBalance
  payment: WalletBalance
  subscription: WalletBalance
}

function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString()}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> = {
    success: { icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700", label: "Success" },
    completed: { icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700", label: "Completed" },
    failed: { icon: XCircle, className: "bg-red-100 text-red-700", label: "Failed" },
    cancelled: { icon: XCircle, className: "bg-red-100 text-red-700", label: "Cancelled" },
    timeout: { icon: Clock, className: "bg-amber-100 text-amber-700", label: "Timed Out" },
    insufficient_balance: { icon: AlertCircle, className: "bg-amber-100 text-amber-700", label: "Insufficient Balance" },
    pending: { icon: Clock, className: "bg-yellow-100 text-yellow-700", label: "Pending" },
  }

  const c = config[status] || { icon: Clock, className: "bg-gray-100 text-gray-600", label: status }
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${c.className}`}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  )
}

function StkPushForm() {
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !amount) {
      toast.error("Phone number and amount are required")
      return
    }

    const numAmount = Number(amount)
    if (numAmount < 1) {
      toast.error("Minimum amount is KSh 1")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stk-push",
          phone,
          amount: numAmount,
          customerName: customerName || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to initiate STK push")
        return
      }
      toast.success("STK push sent! The customer should see an M-Pesa prompt on their phone.")
      setPhone("")
      setAmount("")
      setCustomerName("")
      mutate("/api/admin/payments?action=transactions")
    } catch {
      toast.error("Failed to initiate STK push")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Customer Name (optional)</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="e.g. Jane Doe"
          className="w-full h-10 px-3 border border-border rounded-md text-sm bg-background"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678 or 254712345678"
            className="w-full h-10 pl-10 pr-3 border border-border rounded-md text-sm bg-background"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Kenyan Safaricom number</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Amount (KES)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
          className="w-full h-10 px-3 border border-border rounded-md text-sm bg-background"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        {loading ? "Sending STK Push..." : "Send M-Pesa Prompt"}
      </button>
    </form>
  )
}

function PayHeroBalanceCards({
  balances,
  loading,
  error,
  notConfigured,
}: {
  balances: PayHeroBalances | { error: string } | undefined
  loading: boolean
  error: unknown
  notConfigured: boolean
}) {
  if (notConfigured) return null
  const errMsg =
    error
      ? "Could not reach the PayHero balance API."
      : balances && !("service" in (balances as Record<string, unknown>))
        ? (balances as { error?: string }).error || "Could not load PayHero balances."
        : null

  const safe = (balances && "service" in (balances as Record<string, unknown>)) ? (balances as PayHeroBalances) : null
  const formatBal = (b: WalletBalance) => {
    if (b.balance === null || b.balance === undefined) return "—"
    return `${b.currency || "KES"} ${Number(b.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const cards: { key: keyof PayHeroBalances; icon: typeof Wallet; accent: string }[] = [
    { key: "service", icon: Banknote, accent: "text-emerald-600" },
    { key: "payment", icon: Wallet, accent: "text-blue-600" },
    { key: "subscription", icon: PiggyBank, accent: "text-purple-600" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">PayHero Balances</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live balances from your PayHero account. Service Wallet covers STK push costs; Payments Wallet holds funds from customers awaiting withdrawal.
          </p>
        </div>
      </div>
      {errMsg && (
        <div className="flex items-start gap-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-800 mb-3">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs">{errMsg}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ key, icon: Icon, accent }) => {
          const b = safe?.[key]
          return (
            <div key={key} className="p-4 rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {b?.label || (key === "service" ? "Service Wallet" : key === "payment" ? "Payments Wallet" : "Subscription Wallet")}
                </p>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
              {loading && !safe ? (
                <p className="text-2xl font-bold mt-1 text-muted-foreground animate-pulse">...</p>
              ) : b?.error ? (
                <>
                  <p className="text-lg font-bold mt-1 text-muted-foreground">—</p>
                  <p className="text-[11px] text-amber-700 mt-1 line-clamp-2" title={b.error}>{b.error}</p>
                </>
              ) : (
                <p className={`text-2xl font-bold mt-1 ${accent}`}>{b ? formatBal(b) : "—"}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AdminPayments() {
  const [activeTab, setActiveTab] = useState<"transactions" | "stk-push" | "card-payments">("transactions")
  const { data: transactions, isLoading: txLoading } = useSWR<MpesaTransaction[] | { error: string }>(
    "/api/admin/payments?action=transactions",
    fetcher,
    { refreshInterval: 15000 }
  )
  const { data: cardPayments, isLoading: cpLoading } = useSWR<CardPaymentOrder[]>(
    "/api/admin/payments?action=card-payments",
    fetcher,
    { refreshInterval: 15000 }
  )
  // PayHero balance fetch is disabled while the balance card is hidden.

  const notConfigured = Array.isArray(transactions) === false &&
    (transactions as { error?: string })?.error?.toLowerCase().includes("not configured")

  const txList: MpesaTransaction[] = Array.isArray(transactions) ? transactions : []
  const cpList = Array.isArray(cardPayments) ? cardPayments : []

  const successCount = txList.filter((t) => t.status === "success").length
  const pendingCount = txList.filter((t) => t.status === "pending").length
  const failedCount = txList.filter((t) => ["failed", "cancelled", "timeout", "insufficient_balance"].includes(t.status)).length
  const totalRevenue = txList.filter((t) => t.status === "success").reduce((sum, t) => sum + (t.amount || 0), 0)
  const cardPaymentCount = cpList.length
  const cardPaymentTotal = cpList.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <AdminShell title="Payments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Payments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage M-Pesa payments via PayHero, view card payment orders, and send STK push requests to customers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              mutate("/api/admin/payments?action=transactions")
              mutate("/api/admin/payments?action=card-payments")
              toast.success("Refreshed")
            }}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary transition-colors self-start"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* PayHero Balances (hidden for now) */}

        {/* Config Warning */}
        {notConfigured && (
          <div className="flex items-start gap-3 p-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">PayHero Not Configured</p>
              <p className="text-xs mt-1">
                Set the following environment variables in Netlify: <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono text-[11px]">PAYHERO_API_USERNAME</code>, <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono text-[11px]">PAYHERO_API_PASSWORD</code>, and <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono text-[11px]">PAYHERO_CHANNEL_ID</code>. Get credentials from{" "}
                <a href="https://docs.payhero.co.ke/" target="_blank" rel="noopener noreferrer" className="underline font-medium">docs.payhero.co.ke</a>.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">M-Pesa Revenue</p>
            <p className="text-2xl font-bold mt-1">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{successCount} successful</p>
          </div>
          <div className="p-4 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">{pendingCount}</p>
          </div>
          <div className="p-4 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Failed / Cancelled</p>
            <p className="text-2xl font-bold mt-1 text-red-600">{failedCount}</p>
          </div>
          <div className="p-4 rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Card Orders</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{cardPaymentCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(cardPaymentTotal)} total</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-6">
            {[
              { key: "transactions" as const, label: "M-Pesa Transactions", icon: CreditCard },
              { key: "card-payments" as const, label: "Card Payments", icon: Wallet },
              { key: "stk-push" as const, label: "Send STK Push", icon: Send },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            {txLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading transactions...</div>
            ) : txList.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No M-Pesa transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Customer orders paid via M-Pesa will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Order No</th>
                      <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                      <th className="pb-3 font-medium text-muted-foreground">Phone</th>
                      <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">M-PESA Ref</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txList.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 font-mono text-xs font-medium">{tx.orderNo}</td>
                        <td className="py-3">{tx.customer}</td>
                        <td className="py-3 text-sm">{tx.phone || "—"}</td>
                        <td className="py-3 font-medium">{formatPrice(tx.amount)}</td>
                        <td className="py-3"><StatusBadge status={tx.status} /></td>
                        <td className="py-3 font-mono text-xs">{tx.providerReference || "—"}</td>
                        <td className="py-3 text-muted-foreground text-xs">{tx.createdAt ? formatDate(tx.createdAt) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Card Payments Tab */}
        {activeTab === "card-payments" && (
          <div>
            {cpLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading card payments...</div>
            ) : cpList.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No card payment orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Order No</th>
                      <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                      <th className="pb-3 font-medium text-muted-foreground">Phone</th>
                      <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cpList.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 font-mono text-xs font-medium">{order.order_no}</td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm">{order.customer_name}</p>
                            {order.customer_email && (
                              <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-sm">{order.customer_phone}</td>
                        <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                        <td className="py-3"><StatusBadge status={order.status} /></td>
                        <td className="py-3 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                        <td className="py-3 text-xs text-muted-foreground max-w-[200px] truncate">{order.order_notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STK Push Tab */}
        {activeTab === "stk-push" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border border-border rounded-md">
              <h3 className="font-medium mb-1">Send M-Pesa STK Push</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Send a payment prompt directly to a customer&apos;s phone via PayHero.
              </p>
              <StkPushForm />
            </div>
            <div className="p-6 border border-border rounded-md bg-secondary/30">
              <h3 className="font-medium mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">1</span>
                  <span>Enter the customer&apos;s Safaricom number and amount.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">2</span>
                  <span>PayHero delivers an STK push to their phone.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">3</span>
                  <span>They enter their M-PESA PIN to authorize payment.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">4</span>
                  <span>The PayHero webhook updates the transaction list above.</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
