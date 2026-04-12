import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const SITE_URL = "https://classycollections.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages (only pages that should be indexed — excludes noindex pages like privacy-policy, terms, etc.)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop/men`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop/women`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop/babyshop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop?filter=new`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/shop?filter=offers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Try to fetch dynamic pages from Supabase, but never let DB errors break the sitemap
  let productPages: MetadataRoute.Sitemap = []
  let categoryPages: MetadataRoute.Sitemap = []

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Dynamic product pages
      const { data: products } = await supabase
        .from("products")
        .select("slug, updated_at, created_at")

      productPages = (products || []).map((p) => ({
        url: `${SITE_URL}/product/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))

      // Category pages
      const { data: categories } = await supabase
        .from("categories")
        .select("slug")
        .eq("is_active", true)

      categoryPages = (categories || []).map((c) => ({
        url: `${SITE_URL}/shop?category=${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    }
  } catch {
    // If Supabase is unavailable, return static pages only — never fail the sitemap
  }

  return [...staticPages, ...productPages, ...categoryPages]
}
