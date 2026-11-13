# Frontend Folder Structure Guide

Complete organization of the Tulsi Mishrika frontend codebase.

## 📂 Root Level

```
frontend/
├── public/                 # Static assets (favicon, images, etc.)
├── src/                    # Source code
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 📂 Source Structure (`src/`)

### 🧩 Components (`src/components/`)

Reusable UI components organized by category:

#### `common/` - Generic UI Components
```
components/common/
├── Button.tsx              # Primary, secondary, outline variants
├── Input.tsx               # Form input with label & error states
├── Card.tsx                # Container with shadow & border
├── LoadingSpinner.tsx      # Loading indicator
├── Modal.tsx               # Dialog/modal overlay
├── Badge.tsx               # Status badges (new, sale, etc.)
└── Toast.tsx               # Notification messages
```

#### `layout/` - Layout Components
```
components/layout/
├── Header.tsx              # Top navigation bar
├── Footer.tsx              # Footer with links
├── Container.tsx           # Max-width wrapper
└── Section.tsx             # Page section wrapper
```

#### `product/` - Product Components
```
components/product/
├── ProductCard.tsx         # Product card for grid
├── ProductGrid.tsx         # Grid container for products
├── ProductImage.tsx        # Product image with zoom
└── QuantitySelector.tsx    # +/- quantity buttons
```

#### `cart/` - Cart Components
```
components/cart/
├── CartDrawer.tsx          # Slide-out cart sidebar
├── CartItem.tsx            # Individual cart item
└── CartSummary.tsx         # Subtotal, delivery, total
```

#### `auth/` - Authentication Components
```
components/auth/
├── OTPInput.tsx            # 6-digit OTP input
├── LoginForm.tsx           # Email/phone input
└── ProtectedRoute.tsx      # Route wrapper requiring auth
```

### 📄 Pages (`src/pages/`)

Full page components:

```
pages/
├── Home/
│   └── Home.tsx            # Landing page (pixel-perfect from reference)
├── Shop/
│   └── Shop.tsx            # Product listing with filters
├── ProductDetail/
│   └── ProductDetail.tsx   # Single product view
├── Cart/
│   └── Cart.tsx            # Full cart page
├── Checkout/
│   └── Checkout.tsx        # Checkout form & summary
├── Auth/
│   └── Login.tsx           # OTP login flow
├── Account/
│   └── Account.tsx         # Profile & order history
├── About/
│   └── About.tsx           # About Us page
├── Story/
│   └── Story.tsx           # Our Story page
├── Contact/
│   └── Contact.tsx         # Contact form
└── NotFound/
    └── NotFound.tsx        # 404 error page
```

### 🎨 Layouts (`src/layouts/`)

Page layout wrappers:

```
layouts/
├── MainLayout.tsx          # Header + Content + Footer
└── AuthLayout.tsx          # Centered auth pages (optional)
```

### 🗃️ State Management (`src/store/`)

Zustand stores for global state:

```
store/
├── authStore.ts            # User authentication state
│   ├── user                # Current user object
│   ├── session             # Auth session
│   ├── signIn()            # Login methods
│   ├── signOut()           # Logout method
│   └── initialize()        # Load session on app start
│
├── cartStore.ts            # Shopping cart state
│   ├── items               # Cart items array
│   ├── addItem()           # Add product to cart
│   ├── updateQuantity()    # Change item quantity
│   ├── removeItem()        # Remove from cart
│   ├── clearCart()         # Empty cart
│   ├── getSubtotal()       # Calculate subtotal
│   ├── getTotal()          # Calculate grand total
│   └── syncCart()          # Sync with Supabase
│
└── uiStore.ts              # UI state (optional)
    ├── cartDrawerOpen      # Cart drawer visibility
    ├── mobileMenuOpen      # Mobile menu state
    └── toggleCartDrawer()  # Toggle cart drawer
```

### 🔧 Library Configurations (`src/lib/`)

External library setup:

```
lib/
└── supabase.ts             # Supabase client instance
    ├── supabase            # Client export
    └── TypeScript interfaces (Product, Cart, Order, etc.)
```

### 🎣 Custom Hooks (`src/hooks/`)

Reusable React hooks:

```
hooks/
├── useAuth.ts              # Wrap authStore for easy access
├── useCart.ts              # Wrap cartStore for easy access
├── useProducts.ts          # Fetch products from Supabase
│   ├── useProducts()       # Fetch all products
│   └── useProduct(slug)    # Fetch single product
├── useOrders.ts            # Fetch user orders
└── useForm.ts              # Form validation helper (optional)
```

### 🛠️ Utilities (`src/utils/`)

Helper functions:

```
utils/
├── validation.ts           # Form validation functions
│   ├── validateEmail()
│   ├── validatePhone()
│   └── validatePincode()
│
├── formatting.ts           # Data formatting
│   ├── formatCurrency()    # ₹299.00
│   ├── formatDate()        # Format timestamps
│   └── formatPhone()       # Format phone numbers
│
└── constants.ts            # App-wide constants
    ├── DELIVERY_CHARGE
    ├── TAX_RATE
    └── FREE_DELIVERY_THRESHOLD
```

### 🗺️ Routes (`src/routes/`)

React Router configuration:

```
routes/
└── AppRoutes.tsx           # All route definitions
    ├── / → Home
    ├── /shop → Shop
    ├── /shop/:slug → ProductDetail
    ├── /cart → Cart
    ├── /checkout → Checkout
    ├── /login → Login
    ├── /account → Account (protected)
    ├── /about → About
    ├── /story → Story
    ├── /contact → Contact
    └── * → NotFound
```

### 🎨 Assets (`src/assets/`)

Static images and media:

```
assets/
├── logo.svg                # Tulsi Mishrika logo
├── hero-bg.jpg             # Hero background
├── icons/                  # Custom icons
└── images/                 # Other images
```

## 🎯 File Naming Conventions

### Components
- **PascalCase**: `ProductCard.tsx`, `CartDrawer.tsx`
- **Matches component name**: File `Button.tsx` exports `Button`

### Hooks
- **camelCase**: `useAuth.ts`, `useProducts.ts`
- **Prefix with "use"**: Follows React convention

### Utilities
- **camelCase**: `validation.ts`, `formatting.ts`
- **Descriptive names**: Clear purpose from name

### Pages
- **PascalCase folder & file**: `Home/Home.tsx`
- **One page per folder**: Easier to find related files

## 🔄 Import Patterns

### Absolute Imports (Optional)
Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Then import as:
```tsx
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
```

### Relative Imports
```tsx
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
```

## 📝 Component Structure Template

```tsx
// Imports
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Types
interface MyComponentProps {
  title: string
  onAction?: () => void
}

// Component
export default function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)

  // Effects
  useEffect(() => {
    // Side effects
  }, [])

  // Handlers
  const handleClick = () => {
    setIsActive(!isActive)
    onAction?.()
  }

  // Render
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <button onClick={handleClick}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  )
}
```

## 🧪 Testing Structure (Future)

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx     # Component tests
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts     # Hook tests
└── utils/
    ├── validation.ts
    └── validation.test.ts  # Utility tests
```

## 📦 Build Output

```
dist/
├── assets/                 # Bundled JS & CSS
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html              # Entry HTML
└── ...                     # Other static assets
```

## 🎓 Best Practices

1. **One component per file** - easier to find and maintain
2. **Colocate related files** - put tests, styles next to components
3. **Small, focused components** - single responsibility
4. **Descriptive names** - clear purpose from the name
5. **Group by feature** - organize by domain, not type
6. **Consistent exports** - default export for components
7. **Type everything** - leverage TypeScript fully

## 🔍 Quick Reference

Need to find...

| Looking for... | Go to... |
|----------------|----------|
| Button styles | `components/common/Button.tsx` |
| Product card | `components/product/ProductCard.tsx` |
| Cart state | `store/cartStore.ts` |
| Auth logic | `store/authStore.ts` |
| Supabase queries | `hooks/useProducts.ts` |
| Route definitions | `routes/AppRoutes.tsx` |
| Form validation | `utils/validation.ts` |
| Currency formatting | `utils/formatting.ts` |
| Homepage | `pages/Home/Home.tsx` |
| Shop page | `pages/Shop/Shop.tsx` |

---

This structure is designed for scalability, maintainability, and developer experience. As the project grows, you can add more folders and subdivisions as needed.
