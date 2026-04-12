import { CollectionPage } from "@/components/store/collection-page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const VALID_COLLECTIONS = ["men", "women"] as const

const META: Record<string, { title: string; description: string; keywords: string[]; schema: Record<string, unknown> }> = {
  men: {
    title: "Men's Fashion | Classy Collections",
    description: "Shop premium men's fashion at Classy Collections. Tailored suits, casual shirts, and more. Quality clothing for the modern gentleman. Delivered across Kenya.",
    keywords: [
      "mens suits Kenya", "mens shirts", "mens fashion Nairobi", "mens collection",
      "classy collections men", "men's shirts", "fashion Nairobi", "mens formal wear",
      "mens casual wear", "professional men wear", "mens business attire",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Men's Collection",
      description: "Premium men's fashion collection featuring suits, shirts, and more",
      url: "https://classycollections.com/shop/men",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Men's Fashion",
        description: "Curated collection of premium men's clothing from Classy Collections",
        inLanguage: "en",
      },
    },
  },
  women: {
    title: "Women's Bodysuits, Dresses & Trendy Tops | Classy Collections",
    description: "Discover premium women's fashion at Classy Collections. Elegant dresses, trendy bodysuits, tops, corsets, and jackets. Stylish pieces for every occasion. Fast delivery across Kenya.",
    keywords: [
      "womens bodysuits Kenya", "women dresses", "womens fashion Nairobi", "women tops", "corset tops Kenya",
      "women dresses Nairobi", "classy collections women", "wedding guest outfits", "party dresses",
      "casual women wear", "women office wear", "professional women wear", "evening dresses", "holiday outfits",
      "trendy women tops", "matching sets women", "plus size bodysuits", "women accessories",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Women's Collection",
      description: "Premium women's fashion collection featuring bodysuits, dresses, tops, corsets, and jackets",
      url: "https://classycollections.com/shop/women",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Women's Fashion",
        description: "Curated collection of premium women's styles from Classy Collections",
        inLanguage: "en",
      },
    },
  },
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params
  const meta = META[collection]
  if (!meta) return { title: "Collection Not Found" }
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Classy Collections", url: "https://classycollections.com" }],
    creator: "Classy Collections",
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://classycollections.com/shop/${collection}`,
      type: "website",
      siteName: "Classy Collections",
      locale: "en_KE",
      images: [{ url: "https://classycollections.com/logo.png", width: 512, height: 512, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["https://classycollections.com/logo.png"],
      creator: "@_classycollections",
    },
    alternates: {
      canonical: `https://classycollections.com/shop/${collection}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!VALID_COLLECTIONS.includes(collection as typeof VALID_COLLECTIONS[number])) {
    notFound()
  }
  
  const meta = META[collection]
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(meta.schema),
        }}
      />
      <CollectionPage collection={collection} />
    </>
  )
}
