import { CollectionPage } from "@/components/store/collection-page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const VALID_COLLECTIONS = ["men", "women"] as const

const META: Record<string, { title: string; description: string; keywords: string[]; schema: Record<string, unknown> }> = {
  men: {
    title: "Men's Ankara Suits & Shirts | Classy Collections",
    description: "Shop premium men's Ankara fashion at Classy Collections. Tailored suits, casual shirts, palazzo pants, and more. Authentic African print clothing for the modern gentleman. Delivered across Kenya.",
    keywords: [
      "mens ankara suits Kenya", "ankara shirts men", "mens african fashion", "ankara palazzo pants", "mens ankara collection",
      "african print suits", "classy collections men", "men's Ankara shirts", "African fashion Nairobi", "mens formal wear",
      "mens casual ankara", "professional African wear", "ankara business attire", "African print suits for men",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Men's Ankara Collection",
      description: "Premium men's Ankara fashion collection featuring suits, shirts, palazzo pants, and more",
      url: "https://classycollections.com/shop/men",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Men's Ankara Fashion",
        description: "Curated collection of premium men's Ankara clothing from Classy Collections",
        inLanguage: "en",
      },
    },
  },
  women: {
    title: "Vibrant Ankara Dresses & Trendy Tops | Classy Collections",
    description: "Discover premium women's Ankara fashion at Classy Collections. Elegant dresses, trendy kimonos, tops, palazzo pants, and suits. Authentic African print styles for every occasion. Fast delivery across Kenya.",
    keywords: [
      "womens ankara dresses Kenya", "ankara kimonos", "womens african fashion", "ankara tops", "ankara palazzo women",
      "african print dresses", "classy collections women", "Ankara wedding guest outfits", "Ankara party dresses",
      "Ankara casual wear", "Ankara office wear", "professional African wear", "Ankara evening wear", "Ankara holiday outfits",
      "trendy Ankara kimonos", "Ankara matching sets", "plus size Ankara dresses", "Ankara accessories",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Women's Ankara Collection",
      description: "Premium women's Ankara fashion collection featuring dresses, kimonos, tops, palazzo pants, and suits",
      url: "https://classycollections.com/shop/women",
      mainEntity: {
        "@type": "ItemCollection",
        name: "Women's Ankara Fashion",
        description: "Curated collection of premium women's Ankara styles from Classy Collections",
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
