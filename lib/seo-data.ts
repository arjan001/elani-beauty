// Core SEO Identity & 70 Keywords
export const SITE_SEO = {
  siteName: "Classy Collections",
  siteUrl: "https://classycollections.com",
  siteTitle: "Classy Collections | Premium Ankara Suits, Dresses & Kimonos in Nairobi",
  siteDescription:
    "Discover vibrant, ready-made Ankara fashion at Classy Collections. Shop Ankara suits, kimono sets, palazzo pants, and dresses. Premium African prints delivered in Nairobi. Call 0702642324.",
  phone: "+254702642324",
  phoneDisplay: "0702642324",
  email: "info@classycollections.com",
  instagram: "@_classycollections",
  tiktok: "@_classycollections",
  twitter: "@_classycollections",
  whatsapp: "254702642324",
  address: "Nairobi, Kenya",
  
  // All 70 SEO Tags
  allKeywords: [
    "Ankara suits Nairobi",
    "ready-made Ankara wear",
    "African print dresses Kenya",
    "Ankara kimono sets",
    "Ankara palazzo pants",
    "Ankara tops for women",
    "men's Ankara shirts",
    "African fashion Nairobi",
    "modern Ankara styles 2026",
    "Ankara office wear",
    "Ankara wedding guest outfits",
    "high-quality African prints",
    "Classy Collections Nairobi",
    "Ankara streetwear",
    "plus size Ankara dresses",
    "Ankara wrap tops",
    "African wax print clothing",
    "trendy Ankara kimonos",
    "Ankara trousers for ladies",
    "traditional African attire",
    "contemporary African fashion",
    "Ankara shift dresses",
    "Ankara infinity dresses",
    "Ankara casual wear",
    "bespoke African outfits",
    "Ankara jackets Kenya",
    "handmade African clothes",
    "Ankara fashion house",
    "Nairobi fashion boutiques",
    "Ankara accessories",
    "Ankara jumpsuits",
    "bold African prints",
    "Ankara duster coats",
    "Ankara crop tops",
    "Ankara maxi dresses",
    "Ankara pencil skirts",
    "kitenge fashion Kenya",
    "African print suits for men",
    "Ankara matching sets",
    "vibrant African wear",
    "Ankara sundresses",
    "professional African wear",
    "Ankara holiday outfits",
    "African print kimonos",
    "luxury Ankara fashion",
    "affordable Ankara wear",
    "Classy Collections contact",
    "Ankara style inspiration",
    "African heritage clothing",
    "stylish Ankara blouses",
    "Ankara palazzo suits",
    "Ankara short dresses",
    "Ankara long dresses",
    "African print formal wear",
    "Nairobi thrift alternative",
    "premium kitenge designs",
    "Ankara loungewear",
    "Ankara festival outfits",
    "Kenyan fashion brands",
    "Ankara cocktail dresses",
    "Ankara bodycon dresses",
    "African print loungewear",
    "Ankara peplum tops",
    "Ankara flared pants",
    "African print fashionistas",
    "Nairobi clothing stores",
    "Ankara outfits for graduation",
    "stylish African print shirts",
    "Ankara fashion trends",
    "Classy Collections 0702642324",
  ],
}

export const PAGE_SEO = {
  home: {
    title: "Classy Collections - Ready-made Ankara Wear Nairobi",
    description:
      "Shop the latest Ankara suits, shirts, and dresses. High-quality African prints designed for the modern woman and man. Order today!",
  },
  shop: {
    title: "Professional Ankara Suits & Shirts | Classy Collections",
    description:
      "Browse premium Ankara suits and shirts at Classy Collections. Men's and women's Ankara fashion with high-quality African prints. Professional office wear, casual styles, and formal outfits. Delivered across Kenya.",
  },
  menCollection: {
    title: "Men's Ankara Suits & Shirts | Classy Collections",
    description:
      "Shop premium men's Ankara fashion at Classy Collections. Tailored suits, casual shirts, palazzo pants, and more. Authentic African print clothing for the modern gentleman. Delivered across Kenya.",
  },
  womenCollection: {
    title: "Vibrant Ankara Dresses & Trendy Tops | Classy Collections",
    description:
      "Discover premium women's Ankara fashion at Classy Collections. Elegant dresses, trendy kimonos, tops, palazzo pants, and suits. Authentic African print styles for every occasion. Fast delivery across Kenya.",
  },
  wishlist: {
    title: "My Wishlist | Classy Collections",
    description:
      "Save your favourite Ankara fashion pieces to your Classy Collections wishlist. Curate your perfect collection of premium African dresses, suits, kimonos, and more. Shop when ready with fast delivery across Kenya.",
  },
  checkout: {
    title: "Secure Checkout | Classy Collections",
    description:
      "Complete your Classy Collections order securely. Pay via M-PESA or order via WhatsApp. Premium Ankara fashion with fast delivery across Kenya.",
    noindex: true,
  },
  trackOrder: {
    title: "Track Your Order | Classy Collections",
    description:
      "Track your Classy Collections Ankara fashion order in real-time. Get delivery updates and order status. Fast delivery across Kenya and East Africa.",
    noindex: true,
  },
  privacyPolicy: {
    title: "Privacy Policy | Classy Collections",
    description:
      "Learn how Classy Collections collects, uses, and protects your personal information. We're committed to protecting your privacy.",
    noindex: true,
  },
  termsOfService: {
    title: "Terms of Service | Classy Collections",
    description:
      "Review the terms and conditions for using Classy Collections website and services. Shop premium Ankara fashion with confidence.",
    noindex: true,
  },
  refundPolicy: {
    title: "Refund Policy | Classy Collections",
    description:
      "Learn about Classy Collections refund and return policy. We want you to be satisfied with your premium Ankara fashion purchases.",
    noindex: true,
  },
}

export function generateProductKeywords(productName: string, category: string, tags: string[] = []): string[] {
  return [
    productName,
    "Classy Collections",
    "ankara fashion Kenya",
    category || "Ankara fashion",
    ...tags,
    "premium African wear",
    "ready-made Ankara",
    "authentic Ankara",
    "buy ankara online Kenya",
    "Classy Collections Nairobi",
  ]
}
