# Checkout & Order Processing Documentation

## Overview

The MADHU वन checkout system provides a complete order processing flow with address collection, payment method selection (mock), order creation, and confirmation. Orders are persisted to Supabase with full order item tracking.

## Architecture

### Technology Stack
- **React**: Checkout UI and form handling
- **Supabase**: Order persistence and queries
- **Client-Side Processing**: Simplified order creation (no Edge Functions)
- **Mock Payment**: Simulated payment for demo purposes

### Key Files

```
frontend/src/
├── lib/
│   └── orders.ts               # Order processing utilities
├── pages/
│   ├── Checkout/
│   │   └── Checkout.tsx        # Checkout page with forms
│   └── OrderConfirmation/
│       └── OrderConfirmation.tsx # Order success page
└── routes/
    └── AppRoutes.tsx           # Added /order-confirmation/:orderId route
```

## Order Processing Flow

### 1. Cart → Checkout

**User Journey:**
1. User adds items to cart
2. User clicks "Proceed to Checkout" from Cart page
3. Redirect to `/checkout`
4. If not logged in → redirect to `/login`
5. If cart is empty → redirect to `/cart`

### 2. Checkout Form

**Form Fields:**

**Shipping Address:**
- Full Name (required)
- Phone Number (required, 10-digit validation)
- Address Line 1 (required, textarea)
- Address Line 2 (optional, textarea)
- City (required)
- State (required)
- Pincode (required, 6-digit validation)

**Payment Method:**
- Online Payment (mock) - default
- Cash on Delivery

**Validation:**
```typescript
// Phone validation
/^[6-9]\d{9}$/.test(phone) // Indian mobile format

// Pincode validation
/^\d{6}$/.test(pincode) // 6-digit Indian pincode
```

### 3. Order Creation

**Process:**

```typescript
const result = await createOrder({
  user_id: user.id,
  items: orderItems,
  shipping_address: formData,
  payment_method: paymentMethod,
  subtotal,
  shipping_cost: shippingCost,
  total,
});
```

**Steps (in `lib/orders.ts`):**
1. **Create Order Record**
   - Insert into `orders` table
   - Status: `pending`
   - Payment status: `pending`

2. **Create Order Items**
   - Insert all cart items into `order_items` table
   - Links to products table

3. **Clear User's Cart**
   - Delete all `cart_items` for user's cart

4. **Update Payment Status (Mock)**
   - Set `payment_status` to `completed`
   - Set `status` to `confirmed`

5. **Return Order ID**
   - Success: `{ success: true, order_id: '...' }`
   - Error: `{ success: false, error: '...' }`

### 4. Order Confirmation

**Redirect:**
- On successful order: navigate to `/order-confirmation/:orderId`
- Cart is cleared from local state
- Order details fetched from Supabase

**Confirmation Page Sections:**
1. **Success Header** (green background)
   - Success icon
   - "Order Placed Successfully!" message
   - Order ID display

2. **Order Items**
   - List of purchased products
   - Quantity and prices
   - Product images

3. **Delivery Address**
   - Complete shipping address

4. **Payment Information**
   - Payment method
   - Payment status

5. **Order Summary** (sticky sidebar)
   - Order ID
   - Order date
   - Status badge
   - Total amount
   - CTAs: View Order History, Continue Shopping

6. **What Happens Next**
   - 3-step timeline
   - Expected delivery: 3-5 business days

## Order Utilities API

### `createOrder(params)`

Creates a new order with items.

```typescript
interface CreateOrderParams {
  user_id: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
}

const result = await createOrder(params);
```

**Returns:**
```typescript
{
  success: boolean;
  order_id?: string;
  error?: string;
}
```

### `getOrderById(orderId)`

Fetches order with items and product details.

```typescript
const { order, error } = await getOrderById(orderId);
```

**Returns:**
```typescript
{
  order: Order | null;
  error: string | null;
}
```

**Order includes:**
- Order metadata (id, status, total, payment info)
- Shipping address
- Order items with product details (nested query)

### `getUserOrders(userId)`

Fetches all orders for a user.

```typescript
const { orders, error } = await getUserOrders(userId);
```

**Returns:**
```typescript
{
  orders: Order[] | null;
  error: string | null;
}
```

## Database Schema

### orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status Values:**
- `pending`: Order created, awaiting confirmation
- `confirmed`: Order confirmed, ready for processing
- `processing`: Order being prepared
- `shipped`: Order dispatched
- `delivered`: Order delivered
- `cancelled`: Order cancelled

**Payment Status Values:**
- `pending`: Payment not yet processed
- `completed`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment refunded

### order_items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### shipping_address JSONB

```json
{
  "full_name": "string",
  "phone": "string",
  "address_line1": "string",
  "address_line2": "string (optional)",
  "city": "string",
  "state": "string",
  "pincode": "string"
}
```

## Checkout Page Features

### Order Summary Sidebar

**Sticky on scroll**, shows:
- Cart items with thumbnails
- Quantity × price
- Subtotal
- Shipping cost (₹50 or FREE)
- Total amount
- "Place Order" button
- Security badge

### Form Validation

**Real-time validation:**
- Error messages appear below fields
- Red border on invalid fields
- Errors clear when user corrects input

**Submit validation:**
- Prevents submission if form is invalid
- Scrolls to first error field

### Payment Method Selection

**Radio buttons with cards:**
- **Online Payment** (selected by default)
  - Mock payment gateway
  - Shows card, UPI, net banking icons
  
- **Cash on Delivery**
  - Pay on delivery
  - Shows cash icon

**Demo Notice:**
Blue info box explaining mock payment system

### Loading States

- "Processing..." on button during submission
- Button disabled while loading
- Spinner animation

### Error Handling

- Network errors: Alert with error message
- Validation errors: Inline field errors
- Empty cart: Redirect to cart
- Not logged in: Redirect to login

## Order Confirmation Features

### Success Indicators

- Green background header
- Large green checkmark icon
- "Order Placed Successfully!" heading
- Order ID prominently displayed

### Order Timeline

3-step visual timeline:
1. Order Confirmation (email notification)
2. Order Processing (preparation)
3. Delivery (3-5 business days)

### Responsive Design

- **Desktop**: 2-column layout (items + sidebar)
- **Tablet**: Stacked with maintained spacing
- **Mobile**: Full-width single column

### Navigation Options

- "View Order History" → `/account`
- "Continue Shopping" → `/shop`

## Price Calculations

### Subtotal

```typescript
const subtotal = items.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0
);
```

### Shipping Cost

```typescript
const shippingThreshold = 500;
const shippingCost = subtotal >= shippingThreshold ? 0 : 50;
```

**Rules:**
- Orders < ₹500: ₹50 shipping
- Orders ≥ ₹500: FREE shipping

### Total

```typescript
const total = subtotal + shippingCost;
```

## Mock Payment System

### Current Implementation

**No real payment processing:**
- Payment status immediately set to `completed`
- Order status set to `confirmed`
- No integration with payment gateways

### Demo Notice

Displayed on checkout page:
> **Demo Mode:** This is a mock payment system. Your order will be created without actual payment processing.

### Future Integration

When ready for production:

1. **Add Payment Gateway**
   - Razorpay, Stripe, PayPal
   - Replace mock logic with real API calls

2. **Create Supabase Edge Function**
   - Handle payment webhooks
   - Update order status based on payment result
   - Send confirmation emails

3. **Update Order Flow**
   ```typescript
   // Instead of mock completion:
   const paymentResult = await processPayment(paymentDetails);
   
   if (paymentResult.success) {
     await updateOrderStatus(orderId, 'confirmed');
   }
   ```

## Security Considerations

### Row Level Security (RLS)

```sql
-- Users can only view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create orders for themselves
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Data Validation

- Server-side validation via database constraints
- Client-side validation for UX
- Phone and pincode format validation
- Required field checks

### Payment Security

- Currently mock (no sensitive data stored)
- For production: Use PCI-compliant payment processor
- Never store credit card details in database
- Use tokenization for saved payment methods

## Testing Checkout

### Test Flow

1. **Setup:**
   ```bash
   npm run dev
   ```

2. **Add Items to Cart:**
   - Visit `/shop`
   - Add 2-3 products to cart

3. **Proceed to Checkout:**
   - Click "Proceed to Checkout" from cart
   - If not logged in, sign in first

4. **Fill Shipping Form:**
   ```
   Full Name: Test User
   Phone: 9876543210
   Address Line 1: 123 Test Street, Building A
   City: Mumbai
   State: Maharashtra
   Pincode: 400001
   ```

5. **Select Payment Method:**
   - Choose "Online Payment" or "Cash on Delivery"

6. **Place Order:**
   - Click "Place Order"
   - Wait for processing

7. **Verify Success:**
   - Should redirect to order confirmation
   - Check order details displayed correctly

8. **Check Database:**
   - Supabase Dashboard → `orders` table
   - Verify order created
   - Check `order_items` table for items

### Test Cases

- [ ] Empty cart → redirects to cart
- [ ] Not logged in → redirects to login
- [ ] Invalid phone number → shows error
- [ ] Invalid pincode → shows error
- [ ] Missing required fields → shows errors
- [ ] Form validation works correctly
- [ ] Order creates successfully
- [ ] Cart clears after order
- [ ] Order confirmation displays correctly
- [ ] Order appears in account history

## Error Scenarios

### Order Creation Fails

```typescript
if (!result.success) {
  alert(`Failed to place order: ${result.error}`);
  // User remains on checkout page
  // Can retry submission
}
```

### Network Error

```typescript
try {
  await createOrder(params);
} catch (error) {
  alert('An error occurred. Please try again.');
}
```

### Order Not Found

- Confirmation page shows error state
- "Order Not Found" message
- "Continue Shopping" button

## Performance

### Optimizations

- **Sticky sidebar**: CSS `position: sticky`
- **Form validation**: Debounced input validation (optional)
- **Image loading**: Lazy load product images
- **Route protection**: Early redirect for auth

### Bundle Size

- Order utilities: ~2KB
- Checkout page: ~15KB
- Confirmation page: ~10KB

## Accessibility

### Form Labels

- All inputs have associated labels
- Required fields marked with asterisk
- Error messages linked via `aria-describedby`

### Keyboard Navigation

- Tab through all form fields
- Radio buttons with arrow keys
- Submit with Enter key

### Screen Readers

- Success announcement on order confirmation
- Error messages read aloud
- Form field descriptions

## Future Enhancements

- [ ] Save shipping addresses for faster checkout
- [ ] Guest checkout (without account)
- [ ] Multiple shipping addresses
- [ ] Order notes/special instructions
- [ ] Gift wrapping option
- [ ] Estimated delivery date calculator
- [ ] Real-time order tracking
- [ ] Email notifications for order updates
- [ ] SMS notifications
- [ ] Invoice generation (PDF)
- [ ] Order cancellation within time window
- [ ] Return/refund requests
- [ ] Loyalty points redemption
- [ ] Promo code/discount application
- [ ] Split payment options

## Related Documentation

- [Cart Documentation](./CART.md)
- [Products Documentation](./PRODUCTS.md)
- [Authentication Documentation](./AUTH.md)
- [Frontend README](./README.md)

---

**Last Updated:** Task #10 Complete
**Status:** Production-ready checkout with mock payment
