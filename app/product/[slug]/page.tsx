import { ProductDetailPage } from "@/components/store/product-detail-page"
import { getProductBySlug } from "@/lib/supabase-data"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const SITE_URL = "https://classycollections.com"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProductBySlug(slug)
    if (!product) return { title: "Product Not Found | Elani Beauty Hub" }
    const desc = product.description.slice(0, 130) + (product.description.length > 130 ? "..." : "")
    return {
      title: `${product.name} | Premium Fashion at Elani Beauty Hub`,
      description: `${desc} Shop premium women's fashion at Elani Beauty Hub Nairobi. Bodysuits, dresses, tops, corsets & more. Fast delivery Kenya. Call 0702642324.`,
      keywords: [
        product.name, "buy fashion online Kenya", "Elani Beauty Hub", "women fashion Kenya",
        "premium women fashion", "bodysuits Kenya", "dresses Nairobi", "Nairobi fashion",
        product.category || "", product.tags?.join(", ") || "", "order online Kenya",
      ],
      alternates: {
        canonical: `${SITE_URL}/product/${slug}`,
      },
      authors: [{ name: "Elani Beauty Hub", url: SITE_URL }],
      creator: "Elani Beauty Hub",
      openGraph: {
        title: `${product.name} | Elani Beauty Hub Premium Fashion`,
        description: `${desc} Premium women's fashion. Bodysuits, dresses, tops & more. Order now at Elani Beauty Hub Kenya.`,
        url: `${SITE_URL}/product/${slug}`,
        images: product.images[0] ? [{ url: product.images[0], width: 600, height: 800, alt: `${product.name} - Elani Beauty Hub Premium Fashion` }] : [],
        type: "website",
        siteName: "Elani Beauty Hub",
        locale: "en_KE",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Elani Beauty Hub Nairobi`,
        description: `${desc} Shop premium fashion at Elani Beauty Hub Kenya.`,
        images: product.images[0] ? [product.images[0]] : [],
        creator: "@_classycollections",
      },
    }
  } catch {
    return { title: "Product Not Found | Elani Beauty Hub" }
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
        brand: { "@type": "Brand", name: "Elani Beauty Hub - Premium Women's Fashion Kenya" },
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
