# Product Catalog Documentation

## Overview

The Tulsi Mishrika product catalog is built with **Supabase queries** using custom React hooks. Products are fetched from the `products` table with real-time updates and optimistic UI patterns.

## Architecture

### Technology Stack
- **Supabase**: PostgreSQL database with REST API
- **React Hooks**: Custom hooks for data fetching
- **TypeScript**: Type-safe product interfaces
- **React Router**: Dynamic product pages with slug-based routing

### Key Files

```
frontend/src/
├── hooks/
│   └── useProducts.ts          # Custom hooks for fetching products
├── components/
│   └── product/
│       ├── ProductCard.tsx     # Product card component
│       └── index.ts            # Exports
└── pages/
    ├── Shop/
    │   └── Shop.tsx            # Product listing page
    └── ProductDetail/
        └── ProductDetail.tsx    # Individual product page
```

## Custom Hooks

### `useProducts()`

Fetches all available products from Supabase.

```typescript
import { useProducts } from '@/hooks/useProducts';

function MyComponent() {
  const { products, loading, error, refetch } = useProducts();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Returns:**
- `products`: Product[] - Array of available products
- `loading`: boolean - Loading state
- `error`: Error | null - Error object if request fails
- `refetch`: () => Promise<void> - Function to manually refetch products

**Query Details:**
- Filters by `is_available = true`
- Orders by `created_at DESC` (newest first)
- Runs automatically on mount

### `useProduct(slug)`

Fetches a single product by its slug.

```typescript
import { useProduct } from '@/hooks/useProducts';

function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error, refetch } = useProduct(slug);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  return <div>{product.name}</div>;
}
```

**Parameters:**
- `slug`: string - URL-friendly product identifier (e.g., "kunj-mishri")

**Returns:**
- `product`: Product | null - Single product or null if not found
- `loading`: boolean - Loading state
- `error`: Error | null - Error object if request fails
- `refetch`: () => Promise<void> - Function to manually refetch product

**Query Details:**
- Filters by `slug = slug` AND `is_available = true`
- Uses `.single()` to return one result
- Re-runs when slug changes

### `useFeaturedProducts(limit)`

Fetches a limited number of products (useful for homepage).

```typescript
import { useFeaturedProducts } from '@/hooks/useProducts';

function HomePage() {
  const { products, loading, error } = useFeaturedProducts(4);

  return (
    <section>
      <h2>Featured Products</h2>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
```

**Parameters:**
- `limit`: number - Maximum number of products to fetch (default: 4)

**Returns:**
- Same as `useProducts()`

**Query Details:**
- Filters by `is_available = true`
- Orders by `created_at DESC`
- Limits results to specified number

## Components

### ProductCard

Reusable product card component for displaying products in grids.

```tsx
<ProductCard product={product} />
```

**Props:**
- `product`: Product - Product object from Supabase

**Features:**
- Product image with hover zoom effect
- Product name (links to detail page)
- Truncated description (2 lines max)
- Price display with original price strikethrough
- Weight badge
- Stock status indicator ("Out of Stock" or "Only X left!")
- Responsive design
- Click navigates to product detail page

**Styling:**
- Uses Card component with hover effect
- Aspect-square image container
- Gold accent on hover
- Cream background for image placeholder

### Example Usage

```tsx
// Shop page grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Pages

### Shop Page

Full product catalog with filtering and sorting.

**Location:** `/shop`

**Features:**
1. **Header Section**
   - Hero title: "Our Products"
   - Descriptive subtitle
   - Cream background

2. **Product Count**
   - Shows total number of products
   - Updates based on filters

3. **Sort Dropdown**
   - Newest First (default)
   - Price: Low to High
   - Price: High to Low
   - Name: A to Z
   - Client-side sorting (no API calls)

4. **Product Grid**
   - Responsive: 1 col mobile → 2 tablet → 3 desktop → 4 xl
   - 6px gap between cards
   - ProductCard components

5. **States**
   - **Loading**: Centered spinner
   - **Error**: Error icon + message
   - **Empty**: "No products available" message
   - **Success**: Product grid

**Code Structure:**

```tsx
export default function Shop() {
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  // Client-side sorting
  const sortedProducts = [...products].sort((a, b) => { /* ... */ });

  return (
    <>
      <Section background="cream-light">
        {/* Header */}
      </Section>
      <Section background="white">
        {/* Sort + Grid */}
      </Section>
    </>
  );
}
```

### Product Detail Page

Individual product page with full details and purchase options.

**Location:** `/shop/:slug`

**Features:**

1. **Breadcrumb Navigation**
   - Home / Shop / Product Name
   - Clickable links with hover states

2. **Product Image**
   - Large square image (lg:grid-cols-2)
   - Placeholder SVG if no image
   - Cream background

3. **Product Information**
   - Product name (4xl serif font)
   - Stock status badge (if low or out of stock)
   - Price (large, bold) with original price strikethrough
   - Savings badge
   - Full description
   - Product details card (weight, availability, SKU)

4. **Quantity Selector**
   - + / - buttons
   - Disabled when out of stock
   - Max quantity = stock_quantity
   - Live total price calculation

5. **Action Buttons**
   - **Add to Cart**: Primary button (TODO: Task #7)
   - **Buy Now**: Outline button (TODO: Task #10)
   - Both disabled when out of stock
   - Redirects to login if not authenticated

6. **Additional Information**
   - Checkmark list of product benefits
   - Shipping and return policies

7. **States**
   - **Loading**: Centered spinner
   - **Error / Not Found**: Error icon + back button
   - **Success**: Full product details

**Code Structure:**

```tsx
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug || '');
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/shop/${slug}` } });
      return;
    }
    // TODO: Task #7
  };

  // Render loading/error/product states
}
```

## Product Data Model

### TypeScript Interface

```typescript
interface Product {
  id: string;                    // UUID
  name: string;                  // e.g., "Kunj Mishri"
  slug: string;                  // e.g., "kunj-mishri"
  description: string;           // Full product description
  price: number;                 // Current price (e.g., 299)
  original_price: number | null; // Original price for discount display
  weight: number;                // Product weight in grams (e.g., 500)
  image_url: string | null;      // Product image URL
  stock_quantity: number | null; // Available stock (null = unlimited)
  is_available: boolean;         // Whether product is available
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

### Database Schema

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  weight INTEGER NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Seed Data

Two products are seeded by default:

1. **Kunj Mishri**
   - Price: ₹299
   - Original Price: ₹349
   - Weight: 500g
   - Slug: `kunj-mishri`

2. **Baal Mishri**
   - Price: ₹349
   - Original Price: ₹399
   - Weight: 500g
   - Slug: `baal-mishri`

## Formatting Utilities

### Price Formatting

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Usage
formatPrice(299) // "₹299"
formatPrice(1299) // "₹1,299"
```

## Stock Status Logic

```typescript
const isOutOfStock = product.stock_quantity !== null && product.stock_quantity === 0;
const isLowStock = product.stock_quantity !== null && product.stock_quantity <= 10 && product.stock_quantity > 0;

// Display logic
{isOutOfStock && <Badge variant="error">Out of Stock</Badge>}
{isLowStock && <Badge variant="warning">Only {product.stock_quantity} left!</Badge>}
```

**Stock Quantity Rules:**
- `null`: Unlimited stock (no warning)
- `0`: Out of stock (red badge, disabled buttons)
- `1-10`: Low stock warning (orange badge)
- `>10`: Normal stock (no badge)

## Routing

### Product URLs

Products use slug-based URLs for SEO:

```
/shop/kunj-mishri
/shop/baal-mishri
/shop/custom-product-name
```

**Route Definition:**

```tsx
{
  path: '/shop/:slug',
  element: <ProductDetail />,
}
```

**Link Navigation:**

```tsx
<Link to={`/shop/${product.slug}`}>View Product</Link>
```

## Error Handling

### Network Errors

```typescript
try {
  const { data, error: fetchError } = await supabase
    .from('products')
    .select('*');

  if (fetchError) {
    throw fetchError;
  }

  setProducts(data || []);
} catch (err) {
  setError(err instanceof Error ? err : new Error('Failed to fetch products'));
  console.error('Error fetching products:', err);
}
```

### UI Error States

**Shop Page Error:**
- Error icon (red)
- "Failed to load products"
- Error message

**Product Detail Error:**
- Error icon (red)
- "Product Not Found"
- Error message
- "Back to Shop" button

## Performance Optimization

### Client-Side Sorting

Sorting is done client-side to avoid unnecessary API calls:

```typescript
const sortedProducts = [...products].sort((a, b) => {
  switch (sortBy) {
    case 'price-low': return a.price - b.price;
    case 'price-high': return b.price - a.price;
    case 'name': return a.name.localeCompare(b.name);
    default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }
});
```

### Manual Refetch

```typescript
const { products, refetch } = useProducts();

// Trigger manual refetch
<button onClick={refetch}>Refresh Products</button>
```

## Future Enhancements

- [ ] Product search functionality
- [ ] Category/tag filtering
- [ ] Product reviews and ratings
- [ ] Related products section
- [ ] Product image gallery (multiple images)
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Real-time stock updates with Supabase subscriptions
- [ ] Pagination for large catalogs
- [ ] Product variants (size, flavor, etc.)

## Testing Products

### Local Development

1. Ensure `.env` has correct Supabase credentials
2. Push migrations to Supabase:
   ```bash
   cd supabase
   supabase db push
   ```
3. Start dev server:
   ```bash
   cd frontend
   npm run dev
   ```
4. Visit `/shop` to see product catalog
5. Click a product to view details

### Adding Test Products

**Option 1: Supabase Dashboard**
1. Go to Table Editor → products
2. Click "Insert row"
3. Fill in product details
4. Save

**Option 2: SQL Query**
```sql
INSERT INTO products (name, slug, description, price, original_price, weight, is_available)
VALUES (
  'Test Product',
  'test-product',
  'This is a test product description',
  399,
  449,
  250,
  true
);
```

**Option 3: Seed File**
1. Edit `supabase/seed.sql`
2. Add new INSERT statement
3. Run: `supabase db reset` (drops and recreates DB)

## Troubleshooting

### Products Not Loading

- Check browser console for errors
- Verify `.env` has correct Supabase credentials
- Ensure migrations are pushed: `supabase db push`
- Check Supabase Dashboard → Table Editor → products
- Verify RLS policies allow anonymous reads

### Product Not Found (404)

- Verify product slug matches database
- Check that `is_available = true`
- Ensure product exists in database
- Try visiting `/shop` first to see all products

### Images Not Displaying

- Check `image_url` is valid HTTP/HTTPS URL
- Verify CORS allows image loading
- For production, use Supabase Storage
- Placeholder SVG displays when `image_url` is null

### Stock Quantity Not Working

- `null` means unlimited stock (no warnings)
- `0` means out of stock (disabled buttons)
- `1-10` means low stock (orange warning)
- Check database column value

## Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Frontend README](./README.md)
- [Components Documentation](./COMPONENTS.md)
- [Routing Documentation](./ROUTING.md)
- [Authentication Documentation](./AUTH.md)

---

**Last Updated:** Task #6 Complete
**Status:** Production-ready product catalog with Supabase integration
