# React Router Configuration

Complete routing setup for the MADHU वन e-commerce platform.

## 📍 Route Structure

```
/                          → Home page (landing)
/shop                      → Product listing
/shop/:slug                → Product detail page (dynamic)
/cart                      → Shopping cart
/checkout                  → Checkout flow
/login                     → OTP authentication
/account                   → User profile & orders (protected)
/about                     → About Us page
/story                     → Our Story page
/contact                   → Contact page
*                          → 404 Not Found
```

## 🗺️ Router Configuration

**Location:** `src/routes/AppRoutes.tsx`

Uses **React Router v6** with `createBrowserRouter` for data APIs and modern routing features.

### Router Setup

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // All routes here
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
```

### Layout Structure

All routes are nested under `MainLayout` which provides:
- Header (sticky navigation)
- Main content area (`<Outlet />`)
- Footer

This ensures consistent header/footer across all pages while allowing page-specific content.

## 📄 Route Details

### Public Routes

#### Home `/`
**Component:** `src/pages/Home/Home.tsx`
- **Purpose:** Landing page
- **Status:** Placeholder (Task #8 will implement pixel-perfect design)
- **Features:**
  - Hero section
  - Brand introduction
  - CTAs to Shop and About

#### Shop `/shop`
**Component:** `src/pages/Shop/Shop.tsx`
- **Purpose:** Product catalog
- **Status:** Placeholder (Task #6 will implement with Supabase)
- **Features:**
  - Product grid
  - Filters (future)
  - Search (future)

#### Product Detail `/shop/:slug`
**Component:** `src/pages/ProductDetail/ProductDetail.tsx`
- **Purpose:** Single product view
- **Status:** Placeholder (Task #6 will implement)
- **Features:**
  - Dynamic slug parameter
  - Product images
  - Add to cart
  - Product details

**Examples:**
- `/shop/kunj-mishri`
- `/shop/baal-mishri`

#### Cart `/cart`
**Component:** `src/pages/Cart/Cart.tsx`
- **Purpose:** Shopping cart page
- **Status:** Placeholder (Task #7 will implement)
- **Features:**
  - Cart items list
  - Quantity management
  - Price calculations
  - Checkout button

#### Checkout `/checkout`
**Component:** `src/pages/Checkout/Checkout.tsx`
- **Purpose:** Checkout flow
- **Status:** Placeholder (Task #10 will implement)
- **Features:**
  - Shipping form
  - Order summary
  - Payment (mock)

#### About `/about`
**Component:** `src/pages/About/About.tsx`
- **Purpose:** About Us page
- **Status:** Placeholder (Task #12 will add content)
- **Features:**
  - Brand story
  - Mission & values
  - Product quality

#### Our Story `/story`
**Component:** `src/pages/Story/Story.tsx`
- **Purpose:** Brand origin story
- **Status:** Placeholder (Task #12 will add content)
- **Features:**
  - Heritage
  - Craftsmanship
  - Timeline

#### Contact `/contact`
**Component:** `src/pages/Contact/Contact.tsx`
- **Purpose:** Contact information & form
- **Status:** Placeholder (Task #12 will make functional)
- **Features:**
  - Contact form
  - Business info
  - Location

#### Login `/login`
**Component:** `src/pages/Auth/Login.tsx`
- **Purpose:** OTP authentication
- **Status:** Placeholder (Task #5 will implement Supabase Auth)
- **Features:**
  - Email OTP
  - Phone OTP UI
  - Auto-register

---

### Protected Routes

#### Account `/account`
**Component:** `src/pages/Account/Account.tsx`
- **Purpose:** User profile & order history
- **Status:** Placeholder (Task #11 will implement)
- **Protection:** Requires authentication (to be added in Task #5)
- **Features:**
  - Profile info
  - Order history
  - Saved addresses

**Note:** Will be wrapped with `ProtectedRoute` component in Task #5.

---

### Error Routes

#### Not Found `*`
**Component:** `src/pages/NotFound/NotFound.tsx`
- **Purpose:** 404 error page
- **Status:** Complete
- **Features:**
  - Friendly message
  - Navigation options
  - Links to Home and Shop

## 🔐 Protected Route Implementation

**Coming in Task #5:**

```tsx
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

**Usage in router:**
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

## 🧭 Navigation Patterns

### Link Component

Use React Router's `Link` for internal navigation:

```tsx
import { Link } from 'react-router-dom'

// Basic link
<Link to="/shop">Shop</Link>

// Link with Button
<Link to="/shop">
  <Button>Shop Now</Button>
</Link>

// Active link styling (NavLink)
import { NavLink } from 'react-router-dom'

<NavLink
  to="/shop"
  className={({ isActive }) => 
    isActive ? 'text-[#292D08]' : 'text-gray-600'
  }
>
  Shop
</NavLink>
```

### Programmatic Navigation

Use `useNavigate` hook:

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/shop')
  }
  
  const goBack = () => {
    navigate(-1) // Go back one page
  }
  
  return <button onClick={handleClick}>Go to Shop</button>
}
```

### URL Parameters

Access dynamic route parameters with `useParams`:

```tsx
import { useParams } from 'react-router-dom'

function ProductDetail() {
  const { slug } = useParams()
  
  // slug will be 'kunj-mishri' for /shop/kunj-mishri
  
  return <div>Product: {slug}</div>
}
```

### Query Parameters

Use `useSearchParams` for query strings:

```tsx
import { useSearchParams } from 'react-router-dom'

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  
  // /shop?category=sweets&sort=price
  
  const updateFilters = () => {
    setSearchParams({ category: 'sweets', sort: 'name' })
  }
  
  return <div>Category: {category}</div>
}
```

## 📊 Route Organization

### Directory Structure

```
src/pages/
├── Home/
│   └── Home.tsx
├── Shop/
│   └── Shop.tsx
├── ProductDetail/
│   └── ProductDetail.tsx
├── Cart/
│   └── Cart.tsx
├── Checkout/
│   └── Checkout.tsx
├── Auth/
│   └── Login.tsx
├── Account/
│   └── Account.tsx
├── About/
│   └── About.tsx
├── Story/
│   └── Story.tsx
├── Contact/
│   └── Contact.tsx
└── NotFound/
    └── NotFound.tsx
```

Each page is in its own folder for future expansion (e.g., adding page-specific components, hooks, or styles).

## 🎯 Best Practices

1. **Use Link for navigation** - Avoid `<a>` tags for internal links
2. **Prefetch on hover** - React Router automatically prefetches route data
3. **Breadcrumbs** - Use for deep navigation (already in ProductDetail)
4. **Loading states** - Handle async route transitions
5. **Error boundaries** - Catch route-level errors
6. **Scroll restoration** - Automatic scroll to top on navigation
7. **Route parameters** - Use descriptive names (`:slug` not `:id`)
8. **Nested routes** - Use `<Outlet />` for layout composition
9. **Protected routes** - Wrap with auth check components
10. **404 fallback** - Always include catch-all route

## 🔄 Navigation Flow

### User Journey Examples

**Browse to Purchase:**
```
Home → Shop → Product Detail → Cart → Checkout → Account
  ↓      ↓          ↓             ↓        ↓          ↓
  /      /shop      /shop/:slug   /cart    /checkout  /account
```

**Authentication Flow:**
```
Any Protected Page → Login → (Original Page)
       ↓               ↓             ↓
   /account         /login       /account
```

**Content Navigation:**
```
Home → About → Story → Contact → Shop
  ↓      ↓      ↓        ↓         ↓
  /    /about  /story  /contact  /shop
```

## 🚀 Future Enhancements

### Planned Routes (Future Tasks)

- `/orders/:id` - Order detail page
- `/products/category/:category` - Category filtering
- `/search?q=...` - Search results
- `/blog` - Blog/content marketing
- `/faq` - Frequently asked questions
- `/terms` - Terms & conditions
- `/privacy` - Privacy policy
- `/shipping` - Shipping information
- `/returns` - Return policy

### Advanced Features

- **Code splitting** - Lazy load routes
- **Data loaders** - Fetch data before rendering
- **Route transitions** - Animated page changes
- **Middleware** - Route-level guards
- **Analytics** - Track page views
- **SEO** - Meta tags per route

## 📝 Testing Routes

### Manual Testing Checklist

- [ ] All links work correctly
- [ ] Back button navigates properly
- [ ] URL parameters parse correctly
- [ ] 404 page shows for invalid routes
- [ ] Protected routes redirect to login
- [ ] Breadcrumbs show correct path
- [ ] Mobile navigation works
- [ ] Deep links work when shared

### Automated Testing

```tsx
// Example route test
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

test('renders home page', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>
  )
  expect(screen.getByText(/MADHU वन/i)).toBeInTheDocument()
})

test('renders 404 for invalid route', () => {
  render(
    <MemoryRouter initialEntries={['/invalid-route']}>
      <AppRoutes />
    </MemoryRouter>
  )
  expect(screen.getByText(/404/i)).toBeInTheDocument()
})
```

## 🔗 Related Documentation

- [React Router v6 Docs](https://reactrouter.com/en/main)
- [Frontend Folder Structure](./FOLDER_STRUCTURE.md)
- [Components Documentation](./COMPONENTS.md)

---

**Status:** Task #4 Complete - All routes configured and pages created with placeholders
**Routes:** 11 total (1 home, 3 shop, 1 cart, 1 checkout, 1 auth, 1 account, 3 content, 1 404)
**Next:** Task #5 - Implement authentication and protect routes
