-- =====================================================
-- Fix: allow deleting products that have been ordered
-- =====================================================
-- Root cause:
--   Some environments were created from an older schema where
--   order_items.product_id was defined as NOT NULL with
--   ON DELETE RESTRICT. This prevents deleting a product that was
--   ever ordered, because Postgres rejects the delete with
--   "violates foreign key constraint order_items_product_id_fkey".
--
-- Fix:
--   1. Allow NULL on order_items.product_id so the row can live on
--      after the product is removed (the row already carries its own
--      product_name / product_price / product_image, so order history
--      is preserved even when the product is deleted).
--   2. Recreate the foreign key as ON DELETE SET NULL so Postgres
--      handles reference clearing automatically.
--
-- Safe to run multiple times.
-- =====================================================

-- 1. Drop NOT NULL on product_id (if still set)
ALTER TABLE public.order_items
  ALTER COLUMN product_id DROP NOT NULL;

-- 2. Replace the existing foreign key with ON DELETE SET NULL
ALTER TABLE public.order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES public.products(id)
  ON DELETE SET NULL;

-- 3. Same safety net for any legacy referencing tables that might
--    still carry a RESTRICT constraint. IF EXISTS guards protect
--    environments where these tables were never created.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'cart_items') THEN
    EXECUTE 'ALTER TABLE public.cart_items
               DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey';
    EXECUTE 'ALTER TABLE public.cart_items
               ADD CONSTRAINT cart_items_product_id_fkey
               FOREIGN KEY (product_id) REFERENCES public.products(id)
               ON DELETE CASCADE';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'wishlist_items') THEN
    EXECUTE 'ALTER TABLE public.wishlist_items
               DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey';
    EXECUTE 'ALTER TABLE public.wishlist_items
               ADD CONSTRAINT wishlist_items_product_id_fkey
               FOREIGN KEY (product_id) REFERENCES public.products(id)
               ON DELETE CASCADE';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'wishlists') THEN
    EXECUTE 'ALTER TABLE public.wishlists
               DROP CONSTRAINT IF EXISTS wishlists_product_id_fkey';
    EXECUTE 'ALTER TABLE public.wishlists
               ADD CONSTRAINT wishlists_product_id_fkey
               FOREIGN KEY (product_id) REFERENCES public.products(id)
               ON DELETE CASCADE';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'analytics_events') THEN
    EXECUTE 'ALTER TABLE public.analytics_events
               DROP CONSTRAINT IF EXISTS analytics_events_product_id_fkey';
    EXECUTE 'ALTER TABLE public.analytics_events
               ADD CONSTRAINT analytics_events_product_id_fkey
               FOREIGN KEY (product_id) REFERENCES public.products(id)
               ON DELETE SET NULL';
  END IF;
END$$;
