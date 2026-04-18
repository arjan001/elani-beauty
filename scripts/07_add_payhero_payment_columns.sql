-- PayHero payment tracking columns on orders
-- payment_status: pending | success | failed | cancelled | timeout | insufficient_balance
-- payment_reference: the external_reference sent to PayHero (we use order_no)
-- payment_checkout_id: CheckoutRequestID returned by PayHero
-- payment_provider_reference: M-Pesa receipt (MpesaReceiptNumber) from callback
-- payment_result_desc: human-readable result message from the callback
-- payment_updated_at: last time the payment status was touched by webhook/poll

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status varchar DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference varchar;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_checkout_id varchar;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider_reference varchar;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_result_desc text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_updated_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_payment_reference_idx ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS orders_payment_checkout_id_idx ON orders(payment_checkout_id);

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'orders' ORDER BY ordinal_position;
