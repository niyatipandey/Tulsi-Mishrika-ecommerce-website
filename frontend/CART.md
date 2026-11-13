# Shopping Cart Documentation

## Overview

The Tulsi Mishrika shopping cart is built with **Zustand** for state management and **Supabase** for persistence. It features optimistic updates, automatic sync for logged-in users, and localStorage persistence for guest users.

## Architecture

### Technology Stack
- **Zustand**: Lightweight state management with persist middleware
- **Supabase**: PostgreSQL database for cart persistence
- **React**: Component-based UI
- **TypeScript**: Type-safe cart operations

### Key Files

```
frontend/src/
├── store/
│   └── cartStore.ts           # Zustand cart store with Supabase sync
├── components/
│   └── cart/
│       ├── CartItem.tsx       # Individual cart item component
│       ├── CartSummary.tsx    # Order summary with checkout button
│       ├── EmptyCart.tsx      # Empty cart state
│       └── index.ts           # Exports
└── pages/
    └── Cart/
        └── Cart.tsx           # Full cart page
```

## Cart Store API

### State

```typescript
interface CartState {
  items: CartItem[];        // Array of cart items
  loading: boolean;         // Loading state
  initialized: boolean;     // Whether cart has been initialized
}

interface CartItem {
  id: string;              // cart_items.id from Supabase
  product_id: string;      // Product UUID
  product: Product;        // Full product object
  quantity: number;        // Quantity in cart
}
```

### Methods

#### `initialize()`

Initializes the cart by loading data from Supabase (for logged-in users) or localStorage (for guests).

```typescript
const { initialize, initialized } = useCartStore();

useEffect(() => {
  if (!initialized) {
    initialize();
  }
}, [initialized, initialize]);
```

**Behavior:**
- **Logged-in users**: Fetches cart from Supabase (creates cart if doesn't exist)
- **Guest users**: Loads from localStorage via persist middleware
- Sets `initialized = true` when complete

#### `addItem(product, quantity)`

Adds a product to the cart or increases quantity if already exists.

```typescript
const { addItem } = useCartStore();

await addItem(product, 2); // Add 2 units of product
```

**Parameters:**
- `product`: Product - Full product object
- `quantity`: number - Quantity to add

**Behavior:**
1. **Optimistic update**: Immediately updates UI
2. **Supabase sync** (if logged in): Creates/updates cart_items in database
3. **Error handling**: Reverts optimistic update if sync fails

#### `updateQuantity(productId, quantity)`

Updates the quantity of a cart item.

```typescript
const { updateQuantity } = useCartStore();

await updateQuantity(productId, 5); // Set quantity to 5
```

**Parameters:**
- `productId`: string - Product UUID
- `quantity`: number - New quantity (use 0 to remove)

**Behavior:**
- If `quantity <= 0`: Calls `removeItem()` instead
- **Optimistic update**: Immediate UI feedback
- **Supabase sync**: Updates database for logged-in users
- **Rollback**: Reverts on error

#### `removeItem(productId)`

Removes an item from the cart.

```typescript
const { removeItem } = useCartStore();

await removeItem(productId);
```

**Parameters:**
- `productId`: string - Product UUID

**Behavior:**
- **Optimistic update**: Immediately removes from UI
- **Supabase sync**: Deletes cart_items row
- **Rollback**: Restores item on error

#### `clearCart()`

Removes all items from the cart.

```typescript
const { clearCart } = useCartStore();

if (window.confirm('Clear cart?')) {
  await clearCart();
}
```

**Behavior:**
- **Optimistic update**: Clears all items
- **Supabase sync**: Deletes all cart_items for user's cart
- **Rollback**: Restores items on error

#### `getTotalItems()`

Returns total number of items in cart (sum of all quantities).

```typescript
const { getTotalItems } = useCartStore();

const totalItems = getTotalItems(); // e.g., 5
```

**Returns:** number

#### `getTotalPrice()`

Returns total price of all items in cart.

```typescript
const { getTotalPrice } = useCartStore();

const subtotal = getTotalPrice(); // e.g., 1495
```

**Returns:** number (in rupees)

#### `getItem(productId)`

Gets a specific cart item by product ID.

```typescript
const { getItem } = useCartStore();

const cartItem = getItem(productId);
if (cartItem) {
  console.log(`You have ${cartItem.quantity} in cart`);
}
```

**Parameters:**
- `productId`: string - Product UUID

**Returns:** CartItem | undefined

## Components

### CartItem

Displays a single cart item with image, quantity controls, and remove button.

```tsx
<CartItem
  item={cartItem}
  onUpdateQuantity={updateQuantity}
  onRemove={removeItem}
  disabled={false}
/>
```

**Props:**
- `item`: CartItem - Cart item to display
- `onUpdateQuantity`: (productId: string, quantity: number) => void
- `onRemove`: (productId: string) => void
- `disabled?`: boolean - Disable all controls

**Features:**
- Product image with link to product page
- Product name and price (clickable)
- Quantity selector with +/- buttons
- Remove button with trash icon
- Subtotal calculation
- Out of stock indicator
- Responsive design (stacks on mobile)

### CartSummary

Order summary with subtotal, shipping, total, and checkout button.

```tsx
<CartSummary
  subtotal={getTotalPrice()}
  totalItems={getTotalItems()}
  onCheckout={handleCheckout}
  checkoutDisabled={false}
/>
```

**Props:**
- `subtotal`: number - Cart subtotal (before shipping)
- `totalItems`: number - Total number of items
- `onCheckout?`: () => void - Checkout handler (optional)
- `checkoutDisabled?`: boolean - Disable checkout button

**Features:**
- Subtotal display
- Shipping cost calculation (₹50, free above ₹500)
- Free shipping progress bar
- Total calculation
- Checkout button
- Continue shopping button
- Security badge
- Sticky positioning on desktop

**Shipping Logic:**
- Orders < ₹500: ₹50 shipping
- Orders ≥ ₹500: FREE shipping
- Progress bar shows how much more to add for free shipping

### EmptyCart

Empty state shown when cart has no items.

```tsx
<EmptyCart />
```

**Features:**
- Empty cart icon
- "Your cart is empty" message
- Call-to-action text
- "Browse Products" button (links to /shop)
- Centered layout with padding

## Cart Page

Full cart page at `/cart` route.

**Features:**

1. **Header Section**
   - Page title: "Shopping Cart"
   - Item count: "X items in your cart"
   - Cream background

2. **Cart Items Section** (2/3 width on desktop)
   - "Items in Cart" heading
   - "Clear Cart" button (with confirmation)
   - List of CartItem components
   - Bordered container

3. **Cart Summary Section** (1/3 width on desktop)
   - Sticky CartSummary component
   - Shows subtotal, shipping, total
   - Checkout button (redirects to login if not authenticated)

4. **Trust Badges** (bottom)
   - 100% Natural
   - Secure Payment
   - Free Shipping
   - Icon + heading + description

5. **States**
   - **Loading**: Centered spinner
   - **Empty**: EmptyCart component
   - **With Items**: Full cart layout

**Code Structure:**

```tsx
export default function Cart() {
  const { user } = useAuthStore();
  const {
    items,
    loading,
    initialized,
    initialize,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  // Render loading/empty/cart states
}
```

## Add to Cart Flow

### From Product Detail Page

```typescript
// ProductDetail.tsx
import { useCartStore } from '@/store/cartStore';

const { addItem } = useCartStore();
const [adding, setAdding] = useState(false);

const handleAddToCart = async () => {
  if (!product) return;

  setAdding(true);
  try {
    await addItem(product, quantity);
    
    const goToCart = window.confirm(
      `Added ${quantity} × ${product.name} to cart!\n\nGo to cart now?`
    );
    
    if (goToCart) {
      navigate('/cart');
    }
  } catch (error) {
    alert('Failed to add item to cart.');
  } finally {
    setAdding(false);
  }
};
```

**Flow:**
1. User clicks "Add to Cart" button
2. Button shows loading state (`adding = true`)
3. `addItem()` is called with product and quantity
4. Optimistic update: Cart count increases immediately
5. Confirmation dialog: "Go to cart now?"
6. If yes: Navigate to `/cart`
7. If no: Stay on product page
8. Button returns to normal state

### Buy Now Flow

```typescript
const handleBuyNow = async () => {
  if (!user) {
    navigate('/login', { state: { from: `/shop/${slug}` } });
    return;
  }

  setAdding(true);
  try {
    await addItem(product, quantity);
    navigate('/checkout');
  } catch (error) {
    alert('Failed to add item to cart.');
  } finally {
    setAdding(false);
  }
};
```

**Flow:**
1. User clicks "Buy Now" button
2. If not logged in: Redirect to login
3. Add item to cart silently (no confirmation)
4. Navigate directly to `/checkout`

## Header Cart Badge

The header shows a live cart count badge.

```tsx
// Header.tsx
import { useCartStore } from '../../store/cartStore';

const { getTotalItems, initialize, initialized } = useCartStore();
const itemCount = getTotalItems();

useEffect(() => {
  if (!initialized) {
    initialize();
  }
}, [initialized, initialize]);
```

**Features:**
- Shows total item count (sum of all quantities)
- Updates in real-time when cart changes
- Badge only appears when `itemCount > 0`
- Clicking navigates to `/cart`

## Database Integration

### Tables

**carts:**
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**cart_items:**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);
```

### Row Level Security (RLS)

```sql
-- Users can only access their own cart
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only access their own cart items
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );
```

### Queries

**Fetch Cart with Items:**
```typescript
const { data: cart } = await supabase
  .from('carts')
  .select('id')
  .eq('user_id', user.id)
  .single();

const { data: items } = await supabase
  .from('cart_items')
  .select(`
    id,
    product_id,
    quantity,
    products (*)
  `)
  .eq('cart_id', cart.id);
```

**Add Item:**
```typescript
await supabase
  .from('cart_items')
  .insert({
    cart_id: cart.id,
    product_id: product.id,
    quantity: 2,
  });
```

**Update Quantity:**
```typescript
await supabase
  .from('cart_items')
  .update({ quantity: 5 })
  .eq('id', cartItem.id);
```

**Remove Item:**
```typescript
await supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItem.id);
```

## Optimistic Updates

All cart operations use optimistic updates for instant UI feedback.

**Pattern:**

```typescript
const currentItems = get().items;
const item = currentItems.find(i => i.product_id === productId);

// 1. Optimistic update
set({ items: updatedItems });

// 2. Sync with Supabase
try {
  await supabase.from('cart_items').update(...);
} catch (error) {
  // 3. Rollback on error
  set({ items: currentItems });
}
```

**Benefits:**
- Instant UI feedback (no waiting for server)
- Better perceived performance
- Graceful error handling with rollback

## LocalStorage Persistence

For guest users (not logged in), the cart is persisted to localStorage.

**Configuration:**

```typescript
persist(
  (set, get) => ({ /* store definition */ }),
  {
    name: 'cart-storage',
    partialize: (state) => ({
      items: state.items,
    }),
  }
)
```

**Storage Key:** `cart-storage`

**Behavior:**
- Cart automatically saved to localStorage on every change
- Cart restored from localStorage on app load
- Cleared when user logs out (optional)

## Guest vs Logged-In Users

### Guest Users

- Cart stored in **localStorage** only
- No Supabase sync
- Cart persists across page refreshes
- Cart lost if localStorage is cleared
- Can still add/remove items normally

### Logged-In Users

- Cart stored in **Supabase database**
- Synced on every change
- Cart persists across devices
- Cart persists even if localStorage is cleared
- Cart restored on login

### Migration Flow (Guest → Logged-In)

When a guest user logs in with items in their cart:

**Current Implementation:**
- Guest cart (localStorage) is kept
- Logged-in cart (Supabase) is loaded and replaces localStorage cart

**Future Enhancement:**
- Merge guest cart with logged-in cart
- Show confirmation: "Merge carts or discard guest cart?"

## Error Handling

### Network Errors

```typescript
try {
  await supabase.from('cart_items').insert(...);
} catch (error) {
  console.error('Error syncing cart:', error);
  // Revert optimistic update
  set({ items: previousItems });
}
```

### UI Error States

- **Add to Cart fails**: Alert message
- **Sync fails**: Silent rollback (cart still works locally)
- **Load fails**: Empty cart shown

## Performance Optimization

### Memoization

```typescript
// Computed values are calculated on-demand
const totalItems = getTotalItems(); // Runs on every call
```

For better performance, use in components:

```typescript
const totalItems = useCartStore((state) => state.getTotalItems());
```

### Debouncing

Quantity updates are not debounced by default. For better UX:

```typescript
const debouncedUpdateQuantity = debounce(updateQuantity, 300);
```

## Testing Cart

### Local Development

1. Start dev server: `npm run dev`
2. Visit `/shop` and click a product
3. Set quantity and click "Add to Cart"
4. Confirm success and visit `/cart`
5. Update quantities, remove items
6. Clear cart and verify empty state

### Testing Supabase Sync

1. Log in as a user
2. Add items to cart
3. Check Supabase Dashboard → cart_items table
4. Open another browser/device
5. Log in as same user
6. Verify cart items are synced

### Testing Guest Cart

1. Open site in incognito/private mode
2. Add items to cart (without logging in)
3. Refresh page → cart persists
4. Close and reopen browser → cart persists
5. Clear localStorage → cart clears

## Future Enhancements

- [ ] Merge guest cart with logged-in cart on login
- [ ] Cart item stock validation (prevent adding out-of-stock items)
- [ ] Save for later functionality
- [ ] Recently viewed products
- [ ] Recommended products in cart
- [ ] Promo code / discount support
- [ ] Cart expiration (remove old items after X days)
- [ ] Real-time cart sync across tabs (Supabase subscriptions)
- [ ] Product variant support (size, flavor, etc.)
- [ ] Bulk actions (select multiple, remove all)

## Related Documentation

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Supabase Documentation](https://supabase.com/docs)
- [Frontend README](./README.md)
- [Components Documentation](./COMPONENTS.md)
- [Products Documentation](./PRODUCTS.md)
- [Authentication Documentation](./AUTH.md)

---

**Last Updated:** Task #7 Complete
**Status:** Production-ready shopping cart with Supabase sync and optimistic updates
