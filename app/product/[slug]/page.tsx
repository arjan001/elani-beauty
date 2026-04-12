import { ProductDetailPage } from "@/components/store/product-detail-page"
import { getProductBySlug } from "@/lib/supabase-data"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const SITE_URL = "https://classycollections.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProductBySlug(slug)
    if (!product) return { title: "Product Not Found | Classy Collections" }
    const desc = product.description.slice(0, 130) + (product.description.length > 130 ? "..." : "")
    return {
      title: `${product.name} | Premium Ankara Fashion at Classy Collections`,
      description: `${desc} Shop authentic ready-made Ankara fashion at Classy Collections Nairobi. Premium African prints suits, dresses, kimonos & more. Fast delivery Kenya. Call 0702642324.`,
      keywords: [
        product.name, "buy Ankara online Kenya", "Classy Collections", "authentic Ankara", "african print fashion Kenya",
        "ready-made Ankara wear", "premium African fashion", "Ankara dresses", "Ankara suits", "Nairobi fashion",
        product.category || "", product.tags?.join(", ") || "", "order Ankara online",
      ],
      alternates: {
        canonical: `${SITE_URL}/product/${slug}`,
      },
      authors: [{ name: "Classy Collections", url: SITE_URL }],
      creator: "Classy Collections",
      openGraph: {
        title: `${product.name} | Classy Collections Premium Ankara Fashion`,
        description: `${desc} Premium authentic Ankara fashion. Ready-made suits, dresses, kimonos & more. Order now at Classy Collections Kenya.`,
        url: `${SITE_URL}/product/${slug}`,
        images: product.images[0] ? [{ url: product.images[0], width: 600, height: 800, alt: `${product.name} - Classy Collections Premium Ankara Fashion` }] : [],
        type: "website",
        siteName: "Classy Collections",
        locale: "en_KE",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Classy Collections Nairobi`,
        description: `${desc} Shop premium Ankara fashion at Classy Collections Kenya.`,
        images: product.images[0] ? [product.images[0]] : [],
        creator: "@_classycollections",
      },
    }
  } catch {
    return { title: "Product Not Found | Classy Collections" }
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch product for structured data
  let jsonLd = null
  try {
    const product = await getProductBySlug(slug)
    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        url: `${SITE_URL}/product/${slug}`,
        image: product.images,
        brand: { "@type": "Brand", name: "Classy Collections - Premium Authentic Ankara Fashion Kenya" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "KES",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Classy Collections",
            url: SITE_URL,
            telephone: "+254702642324",
            contactType: "Customer Service",
          },
          itemCondition: product.condition === "thrift"
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
        },
        category: product.category,
      }
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailPage slug={slug} />
    </>
  )
}
