import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { requireAuth, rateLimit, rateLimitResponse } from "@/lib/security"

export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { limit: 20, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const supabase = await createClient()
  const body = await request.json()

  try {
    // Find category ID by slug
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", body.categorySlug)
      .single()

    // Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        price: body.price,
        original_price: body.originalPrice || null,
        description: body.description || "",
        category_id: category?.id || null,
        is_new: body.isNew || false,
        is_on_offer: body.isOnOffer || false,
        offer_percentage: body.offerPercentage || 0,
        in_stock: body.inStock ?? true,
        collection: body.collection || "women",
        featured: body.featured || false,
      })
      .select()
      .single()

    if (productError) throw productError

    // Insert images
    if (body.images?.length) {
      const imageRows = body.images.map((imgUrl: string, i: number) => ({
        product_id: product.id,
        image_url: imgUrl,
        alt_text: `${body.name} - Image ${i + 1}`,
        sort_order: i,
        is_primary: i === 0,
      }))
      await supabase.from("product_images").insert(imageRows)
    }

    // Insert variations
    if (body.variations?.length) {
      const variationRows = body.variations.map((v: { type: string; options: string[] }) => ({
        product_id: product.id,
        type: v.type,
        options: v.options,
      }))
      await supabase.from("product_variations").insert(variationRows)
    }

    return NextResponse.json({ id: product.id })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const rl = rateLimit(request, { limit: 20, windowSeconds: 60 })
  if (!rl.success) return rateLimitResponse()
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const supabase = await createClient()
  const body = await request.json()

  try {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", body.categorySlug)
      .single()

    // Update product
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: body.name,
        slug: body.slug,
        price: body.price,
        original_price: body.originalPrice || null,
        description: body.description || "",
        category_id: category?.id || null,
        is_new: body.isNew || false,
        is_on_offer: body.isOnOffer || false,
        offer_percentage: body.offerPercentage || 0,
        in_stock: body.inStock ?? true,
        collection: body.collection || "unisex",
      })
      .eq("id", body.id)

    if (updateError) throw updateError

    // Replace images
    await supabase.from("product_images").delete().eq("product_id", body.id)
    if (body.images?.length) {
      const imageRows = body.images.map((imgUrl: string, i: number) => ({
        product_id: body.id,
        image_url: imgUrl,
        alt_text: `${body.name} - Image ${i + 1}`,
        sort_order: i,
        is_primary: i === 0,
      }))
      await supabase.from("product_images").insert(imageRows)
    }

    // Replace variations
    await supabase.from("product_variations").delete().eq("product_id", body.id)
    if (body.variations?.length) {
      const variationRows = body.variations.map((v: { type: string; options: string[] }) => ({
        product_id: body.id,
        type: v.type,
        options: v.options,
      }))
      await supabase.from("product_variations").insert(variationRows)
    }

    return NextResponse.json({ id: body.id })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return auth.response!

  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 })
  }

  try {
    // Detach/clear every known referencing table so the product row can
    // always be removed regardless of FK cascade mode (CASCADE / SET NULL /
    // RESTRICT) in the current schema. Errors on these are swallowed —
    // missing tables in some environments are expected.
    await supabase.from("order_items").update({ product_id: null }).eq("product_id", id)
    await supabase.from("analytics_events").update({ product_id: null }).eq("product_id", id)
    await supabase.from("product_images").delete().eq("product_id", id)
    await supabase.from("product_variations").delete().eq("product_id", id)
    await supabase.from("product_tags").delete().eq("product_id", id)
    await supabase.from("cart_items").delete().eq("product_id", id)
    await supabase.from("wishlists").delete().eq("product_id", id)
    await supabase.from("wishlist_items").delete().eq("product_id", id)

    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to delete product" },
        { status: 500 },
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete product"
    console.error("Delete product error:", error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
