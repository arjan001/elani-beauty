-- Elani Beauty Hub - Bodysuits Category Products
-- 10 bodysuits, price range KSh 458-700
-- All items: in stock, new arrivals, on offer
-- Images from uploaded photos (duplicates excluded)

-- =============================================================
-- BODYSUIT PRODUCTS
-- =============================================================

-- Bodysuit 1: Black Leopard Cowl Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Leopard Cowl Neck Bodysuit',
  'black-leopard-cowl-bodysuit',
  'Sultry black leopard print bodysuit with draped cowl neckline and adjustable spaghetti straps. Side ruching adds a flattering silhouette. Perfect for a night out.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 2: Black Mock Neck Sleeveless Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Mock Neck Sleeveless Bodysuit',
  'black-mock-neck-bodysuit',
  'Classic black sleeveless bodysuit with a high mock neckline and clean minimalist cut. Ribbed stretch fabric for a snug comfortable fit.',
  458, 570,
  id, true, true, 20,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 3: Nude Off-Shoulder Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Nude Off-Shoulder Bodysuit',
  'nude-off-shoulder-bodysuit',
  'Soft nude off-shoulder bodysuit with short puff sleeves and a smooth suede-like finish. Flattering thong cut for a seamless look under skirts or jeans.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 4: Sage Green Sleeveless Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Sage Green Sleeveless Bodysuit',
  'sage-green-sleeveless-bodysuit',
  'Fresh sage green sleeveless bodysuit with a crew neckline and ribbed stretch fabric. High-cut leg for a flattering everyday essential.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 5: Black Ribbed V-Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Ribbed V-Neck Bodysuit',
  'black-ribbed-vneck-bodysuit',
  'Sleek black ribbed bodysuit with deep V-neckline and thin spaghetti straps. Stretch-fit ribbed fabric moulds to the body beautifully.',
  458, 570,
  id, true, true, 20,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 6: Navy Crew Neck Short Sleeve Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Navy Crew Neck Short Sleeve Bodysuit',
  'navy-crew-neck-bodysuit',
  'Smooth navy blue bodysuit with classic crew neckline and short sleeves. Soft stretchy fabric ideal for layering or wearing solo.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 7: Blush Square Neck Tank Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Blush Square Neck Tank Bodysuit',
  'blush-square-neck-bodysuit',
  'Delicate blush pink tank bodysuit with a square neckline and wide shoulder straps. Lightweight ribbed cotton for comfortable all-day wear.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 8: Emerald Green Cami Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Emerald Green Cami Bodysuit',
  'emerald-cami-bodysuit',
  'Bold emerald green camisole bodysuit with thin spaghetti straps and a scooped neckline. Smooth satin-like fabric with a body-hugging fit.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 9: Black Lace Trim V-Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Lace Trim V-Neck Bodysuit',
  'black-lace-trim-bodysuit',
  'Romantic black bodysuit with delicate lace trim along the V-neckline and adjustable spaghetti straps. Soft jersey fabric for a feminine touch.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- Bodysuit 10: Black Fringe Long Sleeve Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Fringe Long Sleeve Bodysuit',
  'black-fringe-sleeve-bodysuit',
  'Statement black V-neck bodysuit with dramatic fringe detailing along the long bell sleeves. Stretchy fabric for a flattering fit. Show-stopping piece.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'women-bodysuits';

-- =============================================================
-- PRODUCT IMAGES
-- =============================================================

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-leopard-cowl-bodysuit-1.jpg',
  'Black Leopard Cowl Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-leopard-cowl-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-mock-neck-bodysuit-1.jpg',
  'Black Mock Neck Sleeveless Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-mock-neck-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/nude-off-shoulder-bodysuit-1.jpg',
  'Nude Off-Shoulder Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'nude-off-shoulder-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/sage-green-sleeveless-bodysuit-1.jpg',
  'Sage Green Sleeveless Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'sage-green-sleeveless-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-ribbed-vneck-bodysuit-1.jpg',
  'Black Ribbed V-Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-ribbed-vneck-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/navy-crew-neck-bodysuit-1.jpg',
  'Navy Crew Neck Short Sleeve Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'navy-crew-neck-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/blush-square-neck-bodysuit-1.jpg',
  'Blush Square Neck Tank Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'blush-square-neck-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/emerald-cami-bodysuit-1.jpg',
  'Emerald Green Cami Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'emerald-cami-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-lace-trim-bodysuit-1.jpg',
  'Black Lace Trim V-Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-lace-trim-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-fringe-sleeve-bodysuit-1.jpg',
  'Black Fringe Long Sleeve Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-fringe-sleeve-bodysuit';

-- =============================================================
-- PRODUCT VARIATIONS (Sizes)
-- =============================================================

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-leopard-cowl-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'black-mock-neck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'nude-off-shoulder-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'sage-green-sleeveless-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-ribbed-vneck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'navy-crew-neck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'blush-square-neck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'emerald-cami-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-lace-trim-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-fringe-sleeve-bodysuit';

-- =============================================================
-- PRODUCT TAGS
-- =============================================================

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-leopard-cowl-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'date-night');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-mock-neck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'nude-off-shoulder-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'date-night');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'sage-green-sleeveless-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-ribbed-vneck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'date-night');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'navy-crew-neck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'blush-square-neck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'emerald-cami-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'statement-piece');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-lace-trim-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'date-night');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-fringe-sleeve-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'on-offer', 'statement-piece');
