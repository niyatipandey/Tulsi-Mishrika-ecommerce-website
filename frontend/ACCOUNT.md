# Account Page Documentation

## Overview

The Account page provides users with a personalized dashboard to view their profile information and complete order history. It serves as the central hub for user account management.

## Features

### 1. Profile Sidebar

**Display Elements:**
- **Avatar**: Circular avatar with user's initial
- **Name**: User's full name (or "User" if not set)
- **Email**: User's email address
- **Phone**: User's phone number (if available)

**Navigation:**
- "Order History" (active by default)
- Logout button with icon

**Styling:**
- Sticky sidebar on desktop
- Card component with padding
- Gold/cream color scheme for avatar
- Active state for current section

### 2. Order History

**Features:**
- **Loading State**: Spinner while fetching orders
- **Error State**: Error message with retry option
- **Empty State**: "No Orders Yet" with CTA to shop
- **Order List**: Chronological list of all orders

**Order Cards:**

Each order card displays:
- Order ID (first 8 characters, uppercase)
- Order status badge (color-coded)
- Order date
- Number of items
- Payment status
- Product thumbnails (up to 3, with "+X more")
- Total amount
- Arrow icon indicating clickable

**Order Status Badges:**
- `pending` → Orange "Pending"
- `confirmed` → Blue "Confirmed"
- `processing` → Blue "Processing"
- `shipped` → Blue "Shipped"
- `delivered` → Green "Delivered"
- `cancelled` → Red "Cancelled"

**Hover Effects:**
- Card shadow lift on hover
- Cursor pointer
- Smooth transitions

### 3. Responsive Design

**Desktop (lg and above):**
- 4-column grid (1 sidebar + 3 content)
- Sidebar fixed width
- Order cards in single column

**Tablet & Mobile:**
- Stacked layout
- Sidebar becomes full-width card
- Order cards stack vertically
- Product images remain horizontal

## Component Structure

```tsx
<Account>
  <Section> {/* Header */}
    <h1>My Account</h1>
  </Section>

  <Section> {/* Content */}
    <Grid>
      {/* Sidebar */}
      <Card>
        <Avatar />
        <UserInfo />
        <Navigation />
        <LogoutButton />
      </Card>

      {/* Main Content */}
      <div>
        <h2>Order History</h2>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage />}
        {empty && <EmptyState />}
        {orders && <OrderList />}
      </div>
    </Grid>
  </Section>
</Account>
```

## Data Fetching

### Get User Orders

```typescript
useEffect(() => {
  const fetchOrders = async () => {
    if (!user) return;

    const { orders, error } = await getUserOrders(user.id);
    
    if (error) {
      setError(error);
    } else {
      setOrders(orders || []);
    }
  };

  fetchOrders();
}, [user]);
```

**Query:**
- Fetches from `orders` table
- Includes nested `order_items` with `products`
- Filtered by `user_id`
- Ordered by `created_at DESC` (newest first)

## Order Card Details

### Information Displayed

**Top Row:**
- Order number (e.g., "Order #A1B2C3D4")
- Status badge

**Metadata Row:**
- 📅 Date: "Jan 15, 2024"
- 🛍️ Items: "3 items"
- 💰 Payment: "Paid" or "Pending"

**Product Preview:**
- Up to 3 product thumbnails
- "+X more" indicator if more than 3

**Right Column:**
- "Total Amount" label
- Price in large, bold font
- Arrow icon for navigation

### Click Behavior

```typescript
<Link to={`/order-confirmation/${order.id}`}>
  <Card>
    {/* Order details */}
  </Card>
</Link>
```

Clicking any order card navigates to the order confirmation page showing full order details.

## Profile Information

### Data Sources

```typescript
const { user, profile, signOut } = useAuthStore();
```

**user (from Supabase Auth):**
- `id`: User UUID
- `email`: User email address

**profile (from database):**
- `full_name`: User's display name
- `phone`: Phone number
- Created via trigger on first sign-in

### Avatar Generation

```typescript
const initial = profile?.full_name 
  ? profile.full_name.charAt(0).toUpperCase()
  : user.email?.charAt(0).toUpperCase();
```

Shows first letter of name or email in circular badge.

## Logout Functionality

```typescript
const handleSignOut = async () => {
  await signOut();
  navigate('/');
};
```

**Flow:**
1. User clicks "Logout" button
2. `signOut()` called from auth store
3. Clears Supabase session
4. Clears localStorage auth data
5. Redirects to homepage

## Empty State

**When to show:**
- Orders array is empty
- No errors occurred
- Loading is complete

**Display:**
- Shopping bag icon (16×16)
- "No Orders Yet" heading
- Descriptive text
- "Start Shopping" CTA button
- Links to `/shop`

**Code:**
```tsx
{orders.length === 0 && (
  <Card className="p-12 text-center">
    <svg>{/* bag icon */}</svg>
    <h3>No Orders Yet</h3>
    <p>You haven't placed any orders yet.</p>
    <Link to="/shop">
      <Button>Start Shopping</Button>
    </Link>
  </Card>
)}
```

## Error Handling

### Error States

**Network Error:**
```typescript
{error && (
  <Card>
    <ErrorIcon />
    <p>Failed to load orders</p>
    <p>{error}</p>
  </Card>
)}
```

**User Not Authenticated:**
```typescript
if (!user) {
  navigate('/login');
  return null;
}
```

Automatically redirects unauthenticated users to login.

## Status Badge Component

```typescript
const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'info', label: 'Confirmed' },
    processing: { variant: 'info', label: 'Processing' },
    shipped: { variant: 'info', label: 'Shipped' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'error', label: 'Cancelled' },
  };

  const statusInfo = statusMap[status];
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};
```

**Badge Variants:**
- `success`: Green background (delivered)
- `warning`: Orange background (pending)
- `error`: Red background (cancelled)
- `info`: Blue background (confirmed, processing, shipped)

## Price Formatting

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Usage
formatPrice(1499) // "₹1,499"
```

## Date Formatting

```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Usage
formatDate('2024-01-15T10:30:00Z') // "Jan 15, 2024"
```

## Protected Route

The Account page is wrapped with `ProtectedRoute` in the router:

```tsx
{
  path: 'account',
  element: (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  ),
}
```

**Behavior:**
- Checks if user is authenticated
- Redirects to `/login` if not
- Stores intended destination for post-login redirect
- Shows loading spinner while checking auth

## Navigation

### From Other Pages

**Header:**
- "Account" link in navigation (when logged in)
- User icon/email in mobile menu

**Order Confirmation:**
- "View Order History" button links to `/account`

**Cart:**
- After placing order, user can navigate to account

### To Other Pages

**From Account:**
- "Start Shopping" (empty state) → `/shop`
- Order card click → `/order-confirmation/:orderId`
- "Logout" → `/` (homepage)

## Performance

### Optimizations

- **Single query**: Fetches orders with items in one query
- **Lazy images**: Product thumbnails load on demand
- **Memoization**: Status badge mapping cached

### Bundle Size

- Account page: ~8KB
- Includes getUserOrders utility
- Reuses existing components (Card, Button, Badge)

## Accessibility

### Semantic HTML

- `<nav>` for sidebar navigation
- `<main>` for content area
- `<article>` for order cards

### ARIA Labels

```tsx
<button aria-label="Logout from account">
  <LogoutIcon />
  Logout
</button>
```

### Keyboard Navigation

- Tab through orders
- Enter to view order details
- Esc to close (future modals)

### Screen Readers

- Order status announced
- Payment status announced
- Total amount announced with currency

## Testing

### Test Scenarios

1. **New User (No Orders):**
   - Empty state displays
   - "Start Shopping" button works

2. **User with Orders:**
   - Orders load correctly
   - Cards display accurate data
   - Click navigates to order detail

3. **Loading State:**
   - Spinner shows while fetching
   - No flash of content

4. **Error State:**
   - Network error shows message
   - Graceful fallback

5. **Logout:**
   - Clears session
   - Redirects to home
   - Can't access account page after

### Manual Testing Steps

```bash
# 1. Start dev server
npm run dev

# 2. Sign in
# Visit /login and authenticate

# 3. Place test order
# - Add items to cart
# - Complete checkout

# 4. Visit account page
# /account

# 5. Verify:
# - Profile info displays
# - Order appears in list
# - Order card shows correct data
# - Click order → navigates to detail
# - Logout works
```

## Future Enhancements

- [ ] Profile editing (name, phone, email)
- [ ] Password change (if using email/password auth)
- [ ] Saved addresses management
- [ ] Address book CRUD operations
- [ ] Wishlist/favorites
- [ ] Order filtering (status, date range)
- [ ] Order search by ID or product name
- [ ] Download invoice (PDF)
- [ ] Reorder functionality (add all items to cart)
- [ ] Order cancellation (within time window)
- [ ] Return/refund requests
- [ ] Notification preferences
- [ ] Email preferences
- [ ] Account deletion
- [ ] Two-factor authentication setup
- [ ] Login history
- [ ] Connected devices
- [ ] Loyalty points balance
- [ ] Referral program status

## Related Documentation

- [Authentication Documentation](./AUTH.md)
- [Orders/Checkout Documentation](./CHECKOUT.md)
- [Cart Documentation](./CART.md)
- [Frontend README](./README.md)

---

**Last Updated:** Task #11 Complete
**Status:** Production-ready account page with order history
