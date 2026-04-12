// Core SEO Identity & Keywords
export const SITE_SEO = {
  siteName: "Elani Beauty Hub",
  siteUrl: "https://classycollections.com",
  siteTitle: "Elani Beauty Hub | Women's Bodysuits, Dresses, Tops & Jackets in Nairobi",
  siteDescription:
    "Discover premium women's fashion at Elani Beauty Hub. Shop bodysuits, dresses, tops, corsets, and jackets. Stylish curated pieces delivered in Nairobi. Call 0702642324.",
  phone: "+254702642324",
  phoneDisplay: "0702642324",
  email: "info@classycollections.com",
  instagram: "@_classycollections",
  tiktok: "@_classycollections",
  twitter: "@_classycollections",
  whatsapp: "254702642324",
  address: "Nairobi, Kenya",

  // SEO Keywords
  allKeywords: [
    "women bodysuits Nairobi",
    "bodysuit collection Kenya",
    "women dresses Kenya",
    "corset tops Nairobi",
    "women tops Kenya",
    "jackets for women Nairobi",
    "women fashion Nairobi",
    "modern women styles 2026",
    "office wear women Kenya",
    "wedding guest outfits Kenya",
    "high-quality women fashion",
    "Elani Beauty Hub Nairobi",
    "streetwear women Kenya",
    "plus size bodysuits",
    "lace dresses Kenya",
    "floral tops Nairobi",
    "trendy women clothing",
    "bodycon dresses Kenya",
    "casual women wear",
    "bespoke women outfits",
    "turtleneck bodysuits",
    "handmade women clothes",
    "fashion house Nairobi",
    "Nairobi fashion boutiques",
    "women accessories",
    "jumpsuits Kenya",
    "bold fashion prints",
    "crop tops Nairobi",
    "maxi dresses Kenya",
    "pencil skirts Nairobi",
    "fashion Kenya",
    "matching sets women",
    "vibrant women wear",
    "sundresses Kenya",
    "professional women wear",
    "holiday outfits Kenya",
    "luxury women fashion",
    "affordable women wear",
    "Elani Beauty Hub contact",
    "style inspiration Kenya",
    "short dresses Nairobi",
    "long dresses Kenya",
    "formal wear women",
    "Nairobi thrift alternative",
    "premium women designs",
    "loungewear Kenya",
    "festival outfits Nairobi",
    "Kenyan fashion brands",
    "cocktail dresses Kenya",
    "bodycon bodysuits",
    "peplum tops Kenya",
    "flared pants women",
    "fashion Nairobi",
    "Nairobi clothing stores",
    "graduation outfits Kenya",
    "stylish tops Nairobi",
    "fashion trends Kenya",
    "Elani Beauty Hub 0702642324",
    "off-shoulder bodysuits",
    "halter dresses Kenya",
    "corset fashion Nairobi",
    "women blouses Kenya",
    "spaghetti strap bodysuits",
    "elegant evening wear",
    "date night outfits Kenya",
    "going out tops Nairobi",
    "ribbed bodysuits",
    "mesh bodysuits Kenya",
    "women jackets Nairobi",
    "buy women clothing online Kenya",
  ],
}

export const PAGE_SEO = {
  home: {
    title: "Elani Beauty Hub - Women's Bodysuits, Dresses & Tops Nairobi",
    description:
      "Shop the latest bodysuits, dresses, tops, and jackets. Premium women's fashion designed for the modern woman. Order today!",
  },
  shop: {
    title: "Women's Bodysuits, Dresses & Tops | Elani Beauty Hub",
    description:
      "Browse premium bodysuits, dresses, and tops at Elani Beauty Hub. Women's fashion with quality fabrics. Office wear, casual styles, and evening outfits. Delivered across Kenya.",
  },
  menCollection: {
    title: "Men's Fashion | Elani Beauty Hub",
    description:
      "Shop premium men's fashion at Elani Beauty Hub. Tailored suits, casual shirts, and more. Quality clothing for the modern gentleman. Delivered across Kenya.",
  },
  womenCollection: {
    title: "Women's Bodysuits, Dresses & Trendy Tops | Elani Beauty Hub",
    description:
      "Discover premium women's fashion at Elani Beauty Hub. Elegant dresses, trendy bodysuits, tops, corsets, and jackets. Stylish pieces for every occasion. Fast delivery across Kenya.",
  },
  wishlist: {
    title: "My Wishlist | Elani Beauty Hub",
    description:
      "Save your favourite fashion pieces to your Elani Beauty Hub wishlist. Curate your perfect collection of premium bodysuits, dresses, tops, and more. Shop when ready with fast delivery across Kenya.",
  },
  checkout: {
    title: "Secure Checkout | Elani Beauty Hub",
    description:
      "Complete your Elani Beauty Hub order securely. Pay via M-PESA or order via WhatsApp. Premium women's fashion with fast delivery across Kenya.",
    noindex: true,
  },
  trackOrder: {
    title: "Track Your Order | Elani Beauty Hub",
    description:
      "Track your Elani Beauty Hub order in real-time. Get delivery updates and order status. Fast delivery across Kenya and East Africa.",
    noindex: true,
  },
  privacyPolicy: {
    title: "Privacy Policy | Elani Beauty Hub",
    description:
      "Learn how Elani Beauty Hub collects, uses, and protects your personal information. We're committed to protecting your privacy.",
    noindex: true,
  },
  termsOfService: {
    title: "Terms of Service | Elani Beauty Hub",
    description:
      "Review the terms and conditions for using Elani Beauty Hub website and services. Shop premium women's fashion with confidence.",
    noindex: true,
  },
  refundPolicy: {
    title: "Refund Policy | Elani Beauty Hub",
    description:
      "Learn about Elani Beauty Hub refund and return policy. We want you to be satisfied with your premium fashion purchases.",
    noindex: true,
  },
}

export function generateProductKeywords(productName: string, category: string, tags: string[] = []): string[] {
  return [
    productName,
    "Elani Beauty Hub",
    "women fashion Kenya",
    category || "women fashion",
    ...tags,
    "premium women wear",
    "quality fashion",
    "buy women clothing online Kenya",
    "Elani Beauty Hub Nairobi",
  ]
}
