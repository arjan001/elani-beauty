"use client"

import { useState, useEffect } from "react"
import { Save, Globe, Palette, FileText, Search, Plus, Pencil, Trash2, X, Check, ExternalLink, Eye, EyeOff } from "lucide-react"
import { AdminShell } from "./admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminSettings() {
  const { data: settings, mutate } = useSWR("/api/admin/settings", fetcher)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    storeName: "", storeTagline: "", storeEmail: "", storePhone: "", storeAddress: "",
    currency: "KSh", whatsappNumber: "",
    metaTitle: "", metaDescription: "", metaKeywords: "",
    primaryColor: "#0a0a0a", secondaryColor: "#fafafa",
    fontHeading: "Playfair Display", fontBody: "Inter",
    logoUrl: "", faviconUrl: "",
    footerText: "",
    socialInstagram: "", socialTiktok: "", socialTwitter: "", socialFacebook: "",
    freeShippingThreshold: 5000,
    enableWhatsappCheckout: true, enableNewsletter: true, maintenanceMode: false,
  })

  useEffect(() => {
    if (settings && !settings.error) {
      setForm({
        storeName: settings.store_name || "",
        storeTagline: settings.store_tagline || "",
        storeEmail: settings.store_email || "",
        storePhone: settings.store_phone || "",
        storeAddress: settings.store_address || "",
        currency: settings.currency || "KSh",
        whatsappNumber: settings.whatsapp_number || "",
        metaTitle: settings.meta_title || "",
        metaDescription: settings.meta_description || "",
        metaKeywords: settings.meta_keywords || "",
        primaryColor: settings.primary_color || "#0a0a0a",
        secondaryColor: settings.secondary_color || "#fafafa",
        fontHeading: "Playfair Display",
        fontBody: "Inter",
        logoUrl: settings.logo_url || "",
        faviconUrl: settings.favicon_url || "",
        footerText: settings.footer_about || "",
        socialInstagram: settings.instagram_url || "",
        socialTiktok: settings.tiktok_url || "",
        socialTwitter: settings.twitter_url || "",
        socialFacebook: settings.facebook_url || "",
        freeShippingThreshold: 5000,
        enableWhatsappCheckout: true,
        enableNewsletter: settings.show_newsletter_popup ?? true,
        maintenanceMode: settings.maintenance_mode ?? false,
      })
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    mutate()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminShell title="Settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your store configuration, SEO, theme and footer.</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-foreground text-background hover:bg-foreground/90">
            <Save className="h-4 w-4 mr-2" />
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="bg-secondary flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="footer">Footer & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Store Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-medium mb-1.5 block">Store Name</Label><Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Tagline</Label><Input value={form.storeTagline} onChange={(e) => setForm({ ...form, storeTagline: e.target.value })} /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Store Email</Label><Input value={form.storeEmail} onChange={(e) => setForm({ ...form, storeEmail: e.target.value })} /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Store Phone</Label><Input value={form.storePhone} onChange={(e) => setForm({ ...form, storePhone: e.target.value })} /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">WhatsApp Number</Label><Input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="254..." /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Currency Symbol</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
                </div>
                <div><Label className="text-sm font-medium mb-1.5 block">Store Address</Label><Textarea value={form.storeAddress} onChange={(e) => setForm({ ...form, storeAddress: e.target.value })} rows={2} /></div>
              </div>

              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Checkout & Features</h3>
                <div><Label className="text-sm font-medium mb-1.5 block">Free Shipping Threshold (KSh)</Label><Input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })} /></div>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">WhatsApp Checkout</p><p className="text-xs text-muted-foreground">Enable ordering via WhatsApp</p></div>
                    <Switch checked={form.enableWhatsappCheckout} onCheckedChange={(checked) => setForm({ ...form, enableWhatsappCheckout: checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">Newsletter</p><p className="text-xs text-muted-foreground">Display newsletter signup on homepage</p></div>
                    <Switch checked={form.enableNewsletter} onCheckedChange={(checked) => setForm({ ...form, enableNewsletter: checked })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">Maintenance Mode</p><p className="text-xs text-muted-foreground">Temporarily disable the storefront</p></div>
                    <Switch checked={form.maintenanceMode} onCheckedChange={(checked) => setForm({ ...form, maintenanceMode: checked })} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <SeoManager />
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"><Palette className="h-4 w-4" /> Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-medium mb-1.5 block">Logo Image URL</Label><Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="Optional" /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Favicon URL</Label><Input value={form.faviconUrl} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="Optional" /></div>
                </div>
              </div>
              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Colors & Fonts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="w-10 h-10 border border-border rounded-sm cursor-pointer" />
                      <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="w-10 h-10 border border-border rounded-sm cursor-pointer" />
                      <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Heading Font</Label>
                    <Select value={form.fontHeading} onValueChange={(val) => setForm({ ...form, fontHeading: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                        <SelectItem value="Libre Baskerville">Libre Baskerville</SelectItem>
                        <SelectItem value="DM Serif Display">DM Serif Display</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Body Font</Label>
                    <Select value={form.fontBody} onValueChange={(val) => setForm({ ...form, fontBody: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="DM Sans">DM Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Outfit">Outfit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="mt-6">
            <div className="max-w-2xl space-y-6">
              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"><FileText className="h-4 w-4" /> Footer Content</h3>
                <div><Label className="text-sm font-medium mb-1.5 block">Footer Text / Description</Label><Textarea value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} rows={3} /></div>
              </div>
              <div className="border border-border rounded-sm p-6 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Social Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-medium mb-1.5 block">Instagram URL</Label><Input value={form.socialInstagram} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">TikTok URL</Label><Input value={form.socialTiktok} onChange={(e) => setForm({ ...form, socialTiktok: e.target.value })} placeholder="https://tiktok.com/..." /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Twitter/X URL</Label><Input value={form.socialTwitter} onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })} placeholder="https://x.com/..." /></div>
                  <div><Label className="text-sm font-medium mb-1.5 block">Facebook URL</Label><Input value={form.socialFacebook} onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  )
}

// ── Full SEO Manager ──────────────────────────────────────────────

interface SeoPage {
  id: string; page_path: string; page_title: string; meta_title: string
  meta_description: string; meta_keywords: string; og_title: string
  og_description: string; og_image: string; canonical_url: string
  no_index: boolean; no_follow: boolean; structured_data: unknown
  created_at: string; updated_at: string
}

const emptySeo: Partial<SeoPage> = {
  page_path: "", page_title: "", meta_title: "", meta_description: "",
  meta_keywords: "", og_title: "", og_description: "", og_image: "",
  canonical_url: "", no_index: false, no_follow: false,
}

function SeoManager() {
  const { data: pages = [], mutate } = useSWR<SeoPage[]>("/api/admin/seo", fetcher)
  const [editing, setEditing] = useState<Partial<SeoPage> | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = pages.filter((p) =>
    p.page_path.toLowerCase().includes(search.toLowerCase()) ||
    (p.page_title || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    })
    mutate()
    setSaving(false)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this SEO entry?")) return
    await fetch("/api/admin/seo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    mutate()
  }

  const titleLen = (editing?.meta_title || "").length
  const descLen = (editing?.meta_description || "").length

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} SEO Entry</h3>
              <p className="text-xs text-muted-foreground">{editing.page_path || "Set the page path"}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving || !editing.page_path} className="bg-foreground text-background hover:bg-foreground/90">
            <Check className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save SEO"}
          </Button>
        </div>

        {/* Page path */}
        <div className="border border-border rounded-sm p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Page</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Page Path</Label>
              <Input value={editing.page_path || ""} onChange={(e) => setEditing({ ...editing, page_path: e.target.value })} placeholder="e.g. / or /shop" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Page Label</Label>
              <Input value={editing.page_title || ""} onChange={(e) => setEditing({ ...editing, page_title: e.target.value })} placeholder="e.g. Home, Shop" />
            </div>
          </div>
        </div>

        {/* Meta tags with live character counters */}
        <div className="border border-border rounded-sm p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="h-3.5 w-3.5" /> Meta Tags
          </h4>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm font-medium">Meta Title</Label>
              <span className={`text-xs ${titleLen > 60 ? "text-destructive" : titleLen > 50 ? "text-amber-500" : "text-muted-foreground"}`}>
                {titleLen}/60
              </span>
            </div>
            <Input value={editing.meta_title || ""} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} placeholder="Page title for search engines" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm font-medium">Meta Description</Label>
              <span className={`text-xs ${descLen > 160 ? "text-destructive" : descLen > 140 ? "text-amber-500" : "text-muted-foreground"}`}>
                {descLen}/160
              </span>
            </div>
            <Textarea value={editing.meta_description || ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} rows={3} placeholder="Description shown in search results" />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Meta Keywords</Label>
            <Textarea value={editing.meta_keywords || ""} onChange={(e) => setEditing({ ...editing, meta_keywords: e.target.value })} rows={2} placeholder="Comma-separated keywords" />
          </div>
        </div>

        {/* Google preview */}
        <div className="border border-border rounded-sm p-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Eye className="h-3.5 w-3.5" /> Google Search Preview
          </h4>
          <div className="bg-secondary/30 rounded-sm p-4 space-y-1">
            <p className="text-sm text-blue-600 font-medium truncate">{editing.meta_title || editing.page_title || "Page Title"}</p>
            <p className="text-xs text-green-700">{"https://classycollections.com"}{editing.page_path || "/"}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{editing.meta_description || "No description set..."}</p>
          </div>
        </div>

        {/* Open Graph */}
        <div className="border border-border rounded-sm p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" /> Open Graph (Social Sharing)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">OG Title</Label>
              <Input value={editing.og_title || ""} onChange={(e) => setEditing({ ...editing, og_title: e.target.value })} placeholder="Falls back to Meta Title" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">OG Image URL</Label>
              <Input value={editing.og_image || ""} onChange={(e) => setEditing({ ...editing, og_image: e.target.value })} placeholder="1200x630px recommended" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">OG Description</Label>
            <Textarea value={editing.og_description || ""} onChange={(e) => setEditing({ ...editing, og_description: e.target.value })} rows={2} placeholder="Falls back to Meta Description" />
          </div>
        </div>

        {/* Advanced */}
        <div className="border border-border rounded-sm p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Advanced</h4>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Canonical URL</Label>
            <Input value={editing.canonical_url || ""} onChange={(e) => setEditing({ ...editing, canonical_url: e.target.value })} placeholder="Override canonical URL (optional)" />
          </div>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium flex items-center gap-2"><EyeOff className="h-3.5 w-3.5" /> No Index</p>
                <p className="text-xs text-muted-foreground">Hide this page from search engine indexing</p>
              </div>
              <Switch checked={editing.no_index ?? false} onCheckedChange={(checked) => setEditing({ ...editing, no_index: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">No Follow</p>
                <p className="text-xs text-muted-foreground">Tell search engines not to follow links on this page</p>
              </div>
              <Switch checked={editing.no_follow ?? false} onCheckedChange={(checked) => setEditing({ ...editing, no_follow: checked })} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="h-4 w-4" /> SEO Manager</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage meta tags, descriptions, Open Graph, and indexing for each page.</p>
        </div>
        <Button onClick={() => setEditing({ ...emptySeo })} className="bg-foreground text-background hover:bg-foreground/90">
          <Plus className="h-4 w-4 mr-2" /> Add Page
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" placeholder="Search pages..." />
      </div>

      <div className="border border-border rounded-sm divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">No SEO entries found</div>
        ) : filtered.map((page) => (
          <div key={page.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{page.page_title || page.page_path}</p>
                {page.no_index && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">noindex</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{page.page_path}</p>
              {page.meta_title && (
                <p className="text-xs text-blue-600 mt-1 truncate">{page.meta_title}</p>
              )}
              {page.meta_description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{page.meta_description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(page)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(page.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
