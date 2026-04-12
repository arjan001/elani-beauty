-- Elani Beauty Hub - Body Suits Category Products
-- 10 thrift body suits, price range KSh 458-700
-- All items: in stock, new arrivals, on offer
-- Images from uploaded photos

-- =============================================================
-- BODY SUIT PRODUCTS
-- =============================================================

-- Body Suit 1: Black Cami Strap Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Cami Strap Bodysuit',
  'black-cami-strap-bodysuit',
  'Sleek black cami bodysuit with delicate spaghetti straps and a flattering scoop neckline. Smooth stretch fabric sits perfectly against the body for a seamless look under any outfit.',
  458, 570,
  id, true, true, 20,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 2: Black Sweetheart Notch Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Sweetheart Notch Bodysuit',
  'black-sweetheart-notch-bodysuit',
  'Bold black bodysuit with a sculpted sweetheart V-notch neckline and wide supportive straps. Structured bodice with a smooth, body-hugging fit that flatters every curve.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 3: Black Lace Trim Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Lace Trim Bodysuit',
  'black-lace-trim-bodysuit',
  'Romantic black bodysuit with intricate floral lace appliqué along the plunging V-neckline and a dainty lace-up tie front. Spaghetti straps and a sensual silhouette make this perfect for date nights.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 4: Grey Turtleneck Long Sleeve Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Grey Turtleneck Long Sleeve Bodysuit',
  'grey-turtleneck-long-sleeve-bodysuit',
  'Classic heather grey turtleneck bodysuit with fitted long sleeves. Soft stretch jersey fabric and a clean, minimalist design that layers beautifully under blazers and jackets.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 5: Pink Lace V-Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Pink Lace V-Neck Bodysuit',
  'pink-lace-vneck-bodysuit',
  'Soft dusty pink ribbed bodysuit with delicate lace trim along the deep V-neckline. Wide shoulder straps and a feminine gathered bust for a vintage-inspired romantic look.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'body-suits';

-- Body Suit 6: Grey Cap Sleeve Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Grey Cap Sleeve Bodysuit',
  'grey-cap-sleeve-bodysuit',
  'Versatile heather grey bodysuit with a round crew neckline and cute cap sleeves. Ribbed stretch cotton for everyday comfort. An essential wardrobe staple.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'body-suits';

-- Body Suit 7: Black Square Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Square Neck Bodysuit',
  'black-square-neck-bodysuit',
  'Chic black bodysuit with a sophisticated square neckline and wide tank straps. Clean lines and a sculpted fit that transitions effortlessly from day to night.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 8: Neon Lime Cami Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Neon Lime Cami Bodysuit',
  'neon-lime-cami-bodysuit',
  'Eye-catching neon lime green bodysuit with ruched bust detail, ruffle trim, and a front tie. Spaghetti straps and a high-cut leg create a bold, fun party look.',
  458, 570,
  id, true, true, 20,
  true, true
FROM categories WHERE slug = 'body-suits';

-- Body Suit 9: White Ribbed Halter Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'White Ribbed Halter Bodysuit',
  'white-ribbed-halter-bodysuit',
  'Fresh white ribbed bodysuit with double-strap halter neckline and a flattering V-cut. Stretchy ribbed knit fabric hugs the figure for a clean, sporty-chic silhouette.',
  458, 570,
  id, true, true, 20,
  true, false
FROM categories WHERE slug = 'body-suits';

-- Body Suit 10: Black Ruffle V-Neck Bodysuit
INSERT INTO products (
  id, name, slug, description, price, original_price,
  category_id, is_new, is_on_offer, offer_percentage,
  in_stock, featured
)
SELECT
  gen_random_uuid(),
  'Black Ruffle V-Neck Bodysuit',
  'black-ruffle-vneck-bodysuit',
  'Statement black bodysuit with a dramatic ruffle collar framing a deep V-neckline. Short flutter sleeves and tie-shoulder detail add playful flair to this elegant piece.',
  570, 700,
  id, true, true, 19,
  true, true
FROM categories WHERE slug = 'body-suits';

-- =============================================================
-- PRODUCT IMAGES
-- =============================================================

-- Black Cami Strap Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-cami-strap-bodysuit-1.jpg',
  'Black Cami Strap Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-cami-strap-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-cami-strap-bodysuit-2.jpg',
  'Black Cami Strap Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'black-cami-strap-bodysuit';

-- Black Sweetheart Notch Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-sweetheart-notch-bodysuit-1.jpg',
  'Black Sweetheart Notch Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-sweetheart-notch-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-sweetheart-notch-bodysuit-2.jpg',
  'Black Sweetheart Notch Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'black-sweetheart-notch-bodysuit';

-- Black Lace Trim Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-lace-trim-bodysuit-1.jpg',
  'Black Lace Trim Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-lace-trim-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-lace-trim-bodysuit-2.jpg',
  'Black Lace Trim Bodysuit - Detail', 1, false
FROM products p WHERE p.slug = 'black-lace-trim-bodysuit';

-- Grey Turtleneck Long Sleeve Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/grey-turtleneck-bodysuit-1.jpg',
  'Grey Turtleneck Long Sleeve Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'grey-turtleneck-long-sleeve-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/grey-turtleneck-bodysuit-2.jpg',
  'Grey Turtleneck Long Sleeve Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'grey-turtleneck-long-sleeve-bodysuit';

-- Pink Lace V-Neck Bodysuit (1 image - duplicate removed)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/pink-lace-vneck-bodysuit-1.jpg',
  'Pink Lace V-Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'pink-lace-vneck-bodysuit';

-- Grey Cap Sleeve Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/grey-cap-sleeve-bodysuit-1.jpg',
  'Grey Cap Sleeve Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'grey-cap-sleeve-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/grey-cap-sleeve-bodysuit-2.jpg',
  'Grey Cap Sleeve Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'grey-cap-sleeve-bodysuit';

-- Black Square Neck Bodysuit (1 image)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-square-neck-bodysuit-1.jpg',
  'Black Square Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-square-neck-bodysuit';

-- Neon Lime Cami Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/neon-lime-cami-bodysuit-1.jpg',
  'Neon Lime Cami Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'neon-lime-cami-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/neon-lime-cami-bodysuit-2.jpg',
  'Neon Lime Cami Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'neon-lime-cami-bodysuit';

-- White Ribbed Halter Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/white-ribbed-halter-bodysuit-1.jpg',
  'White Ribbed Halter Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'white-ribbed-halter-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/white-ribbed-halter-bodysuit-2.jpg',
  'White Ribbed Halter Bodysuit - Detail', 1, false
FROM products p WHERE p.slug = 'white-ribbed-halter-bodysuit';

-- Black Ruffle V-Neck Bodysuit (2 images)
INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-ruffle-vneck-bodysuit-1.jpg',
  'Black Ruffle V-Neck Bodysuit - Front', 0, true
FROM products p WHERE p.slug = 'black-ruffle-vneck-bodysuit';

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary)
SELECT gen_random_uuid(), p.id,
  '/images/products/black-ruffle-vneck-bodysuit-2.jpg',
  'Black Ruffle V-Neck Bodysuit - Angle', 1, false
FROM products p WHERE p.slug = 'black-ruffle-vneck-bodysuit';

-- =============================================================
-- PRODUCT VARIATIONS (Sizes)
-- =============================================================

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-cami-strap-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-sweetheart-notch-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-lace-trim-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'grey-turtleneck-long-sleeve-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'pink-lace-vneck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'grey-cap-sleeve-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'black-square-neck-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'neon-lime-cami-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L']
FROM products p WHERE p.slug = 'white-ribbed-halter-bodysuit';

INSERT INTO product_variations (id, product_id, type, options)
SELECT gen_random_uuid(), p.id, 'Size', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'black-ruffle-vneck-bodysuit';

-- =============================================================
-- PRODUCT TAGS
-- =============================================================

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-cami-strap-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-sweetheart-notch-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'party-wear');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-lace-trim-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'party-wear', 'statement-piece');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'grey-turtleneck-long-sleeve-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'office-wear', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'pink-lace-vneck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'vintage');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'grey-cap-sleeve-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-square-neck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'office-wear');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'neon-lime-cami-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'party-wear', 'statement-piece');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'white-ribbed-halter-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'casual');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, tags t
WHERE p.slug = 'black-ruffle-vneck-bodysuit'
  AND t.slug IN ('thrift', 'new-arrival', 'in-stock', 'statement-piece', 'party-wear');
