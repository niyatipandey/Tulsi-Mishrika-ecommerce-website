# MADHU वन Frontend

React + TypeScript + Vite + Tailwind CSS + Supabase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase project set up (see `/supabase/README.md`)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase dashboard: **Settings > API**

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

You should see the MADHU वन setup status page. If Supabase is configured correctly, you'll see products from the database.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   ├── product/         # Product-related components (ProductCard, etc.)
│   ├── cart/            # Cart components (CartDrawer, CartItem, etc.)
│   └── auth/            # Authentication components (OTPInput, LoginForm, etc.)
├── pages/
│   ├── Home/            # Homepage
│   ├── Shop/            # Product listing
│   ├── ProductDetail/   # Single product page
│   ├── Cart/            # Shopping cart page
│   ├── Checkout/        # Checkout flow
│   ├── Auth/            # Login/OTP pages
│   ├── Account/         # User account & order history
│   ├── About/           # About Us page
│   ├── Story/           # Our Story page
│   ├── Contact/         # Contact page
│   └── NotFound/        # 404 page
├── layouts/             # Page layouts (MainLayout, etc.)
├── store/               # Zustand state management
│   ├── authStore.ts     # Authentication state
│   ├── cartStore.ts     # Shopping cart state
│   └── uiStore.ts       # UI state (modals, drawers, etc.)
├── lib/                 # External library configurations
│   └── supabase.ts      # Supabase client & types
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useCart.ts       # Cart management hook
│   └── useProducts.ts   # Product fetching hook
├── utils/               # Utility functions
│   ├── validation.ts    # Form validation
│   └── formatting.ts    # Currency, date formatting
├── routes/              # React Router configuration
│   └── AppRoutes.tsx    # Route definitions
├── App.tsx              # Main App component
└── main.tsx             # App entry point
```

## 🎨 Design System

The design is based on the MADHU वन brand identity:

### Colors
```javascript
brand: {
  cream: '#FAF7F2',       // Primary background
  beige: '#F5F0E8',       // Secondary background
  brown: {
    50: '#FAF7F2',        // Lightest
    100: '#F5F0E8',
    200: '#E8DED0',
    300: '#D4C5B0',       // Borders
    600: '#4A3425',
    800: '#3D2817',       // Accent
    900: '#2C1810',       // Primary text
  },
  gold: {
    500: '#DAA520',       // CTAs, highlights
    600: '#B8860B',
  }
}
```

### Typography
- **Headings**: Playfair Display (serif) - elegant, traditional
- **Hindi Text**: Noto Serif Devanagari
- **Body**: Inter (sans-serif) - clean, readable

### Usage
```jsx
// Headings
<h1 className="text-4xl font-heading text-[#292D08]">Title</h1>

// Hindi text
<p className="text-xl font-hindi">MADHU वन</p>

// Body text
<p className="font-body text-brand-brown-600">Description</p>

// Buttons
<button className="bg-brand-brown-800 text-white hover:bg-brown-dark">
  Shop Now
</button>
```

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Dependencies

### Core
- **React** 18+ - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Routing & State
- **react-router-dom** - Client-side routing
- **zustand** - State management (lightweight, simple)

### Backend
- **@supabase/supabase-js** - Supabase client (auth, database, storage)

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## 🔐 Authentication

Uses Supabase Auth with OTP (One-Time Password):

- Email OTP (Magic Link)
- Phone OTP (UI only, requires Twilio setup)
- Automatic user profile creation
- Session management with JWT tokens

## 🛒 Shopping Cart

- **Optimistic UI updates** - instant feedback
- **Persistent state** - survives page refresh
- **Supabase sync** - backend synchronization
- **Guest cart** - works without login
- **Cart merge** - combines guest cart on login

## 🎯 Key Features

- ✅ Pixel-perfect homepage matching reference design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ OTP authentication (email + phone UI)
- ✅ Product catalog with Supabase
- ✅ Smooth shopping cart (Swiggy-like UX)
- ✅ Complete checkout flow
- ✅ Order history
- ✅ User account management
- ✅ Premium, elegant design
- ✅ Traditional Indian aesthetic

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` folder.

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build & deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production
Don't forget to set these in your deployment platform:
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

## 🐛 Troubleshooting

### Supabase Not Connecting
1. Check `.env` file exists and has correct values
2. Verify Supabase project is active
3. Ensure migrations were run in Supabase dashboard
4. Restart dev server after changing .env

### Tailwind Styles Not Working
1. Verify `tailwind.config.js` exists
2. Check `postcss.config.js` is present
3. Ensure imports in `index.css` are correct
4. Clear cache and restart dev server

### Type Errors
1. Run `npm install` to ensure all types are installed
2. Check `tsconfig.json` configuration
3. Restart TypeScript server in VS Code

### Build Errors
1. Run `npm run build` to see specific errors
2. Check for unused imports
3. Verify all environment variables are set
4. Update dependencies: `npm update`

## 📚 Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** in `src/` files
3. **Hot reload** updates automatically
4. **Check browser console** for errors
5. **Test on multiple devices** (responsive design)
6. **Build before deploying**: `npm run build`

## 🎨 Component Development

### Creating a New Component
```bash
# Create component file
touch src/components/common/MyComponent.tsx
```

```tsx
// src/components/common/MyComponent.tsx
export default function MyComponent({ title }: { title: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-heading">{title}</h2>
    </div>
  )
}
```

### Using the Component
```tsx
import MyComponent from './components/common/MyComponent'

function App() {
  return <MyComponent title="Hello" />
}
```

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/en/main)

## 📄 License

Private project for MADHU वन e-commerce platform.

---

**Need help?** Check the `/SETUP_GUIDE.md` in the root directory for complete setup instructions.
