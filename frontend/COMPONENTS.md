# Component Library Documentation

Complete documentation for all reusable components in the MADHU वन frontend.

## 📦 Common Components

### Button

Versatile button component with multiple variants and sizes.

**Location:** `src/components/common/Button.tsx`

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline'` - Button style (default: `'primary'`)
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: `'md'`)
- `fullWidth?: boolean` - Full width button (default: `false`)
- `isLoading?: boolean` - Show loading spinner (default: `false`)
- `disabled?: boolean` - Disable button
- All standard HTML button props

**Usage:**
```tsx
import { Button } from '@/components/common'

// Primary button
<Button variant="primary">Shop Now</Button>

// Secondary button
<Button variant="secondary" size="lg">Learn More</Button>

// Outline button
<Button variant="outline">Contact Us</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Full width
<Button fullWidth>Sign Up</Button>
```

**Variants:**
- **Primary**: Brand brown background, white text
- **Secondary**: Gold background, white text
- **Outline**: Brown border, brown text, fills on hover

---

### Input

Form input field with label, error, and helper text support.

**Location:** `src/components/common/Input.tsx`

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message to display
- `helperText?: string` - Helper text below input
- `required?: boolean` - Show required asterisk
- All standard HTML input props

**Usage:**
```tsx
import { Input } from '@/components/common'

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
/>

// With helper text
<Input
  label="Phone Number"
  type="tel"
  helperText="Enter your 10-digit mobile number"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// Required field
<Input
  label="Full Name"
  required
/>
```

**Features:**
- Auto-focus on errors
- Accessible labels
- Disabled state styling
- Clear error/helper text hierarchy

---

### Card

Container component with border, shadow, and optional hover effect.

**Location:** `src/components/common/Card.tsx`

**Props:**
- `hover?: boolean` - Add hover shadow effect (default: `false`)
- All standard HTML div props

**Usage:**
```tsx
import { Card } from '@/components/common'

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Card with hover effect
<Card hover>
  <h3>Interactive Card</h3>
  <p>Hover to see shadow animation</p>
</Card>
```

**Styling:**
- White background
- Subtle border
- Rounded corners
- Padding included
- Optional hover shadow

---

### LoadingSpinner

Animated loading indicator.

**Location:** `src/components/common/LoadingSpinner.tsx`

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: `'md'`)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/common'

// Default size
<LoadingSpinner />

// Large spinner
<LoadingSpinner size="lg" />

// With custom styling
<LoadingSpinner size="md" className="my-8" />
```

**Sizes:**
- **Small**: 16px (w-4 h-4)
- **Medium**: 32px (w-8 h-8)
- **Large**: 48px (w-12 h-12)

---

### Modal

Accessible modal dialog with backdrop and keyboard support.

**Location:** `src/components/common/Modal.tsx`

**Props:**
- `isOpen: boolean` - Control modal visibility (required)
- `onClose: () => void` - Close handler (required)
- `title?: string` - Modal title
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Modal width (default: `'md'`)

**Usage:**
```tsx
import { useState } from 'react'
import { Modal, Button } from '@/components/common'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="md"
      >
        <p>Are you sure you want to proceed?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

**Features:**
- ESC key to close
- Click outside to close
- Focus trap
- Body scroll lock when open
- Smooth animations

---

### Badge

Small status indicator or label.

**Location:** `src/components/common/Badge.tsx`

**Props:**
- `variant?: 'success' | 'warning' | 'error' | 'info' | 'default'` - Badge color (default: `'default'`)
- `size?: 'sm' | 'md' | 'lg'` - Badge size (default: `'md'`)

**Usage:**
```tsx
import { Badge } from '@/components/common'

// Status badges
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error">Out of Stock</Badge>
<Badge variant="info">New</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Variants:**
- **Success**: Green (in stock, completed)
- **Warning**: Yellow (low stock, pending)
- **Error**: Red (out of stock, failed)
- **Info**: Blue (new, information)
- **Default**: Gray (neutral)

---

## 🎨 Layout Components

### Header

Main navigation header with logo, menu, and icons.

**Location:** `src/components/layout/Header.tsx`

**Features:**
- Sticky top navigation
- Brand logo (Hindi + English)
- Desktop horizontal menu
- Mobile hamburger menu
- Search, user, and cart icons
- Cart item count badge
- Responsive design

**Usage:**
```tsx
import { Header } from '@/components/layout'

<Header />
```

**Note:** Header will be updated to use actual auth and cart state once stores are implemented.

---

### Footer

Comprehensive footer with links, contact info, and social media.

**Location:** `src/components/layout/Footer.tsx`

**Features:**
- Multi-column layout
- Quick links
- Customer service links
- Contact information
- Social media icons
- Copyright notice
- Decorative gold border

**Usage:**
```tsx
import { Footer } from '@/components/layout'

<Footer />
```

---

### Container

Max-width container wrapper for consistent page width.

**Location:** `src/components/layout/Container.tsx`

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Container max width (default: `'xl'`)

**Usage:**
```tsx
import { Container } from '@/components/layout'

// Extra large container (default)
<Container>
  <h1>Page Content</h1>
</Container>

// Small container (for forms)
<Container size="sm">
  <form>...</form>
</Container>

// Full width
<Container size="full">
  <div>Edge-to-edge content</div>
</Container>
```

**Sizes:**
- **Small**: max-w-3xl (768px)
- **Medium**: max-w-5xl (1024px)
- **Large**: max-w-6xl (1152px)
- **Extra Large**: max-w-7xl (1280px)
- **Full**: max-w-full (100%)

---

### Section

Page section wrapper with optional background colors.

**Location:** `src/components/layout/Section.tsx`

**Props:**
- `background?: 'cream' | 'white' | 'brown' | 'none'` - Background color (default: `'none'`)

**Usage:**
```tsx
import { Section, Container } from '@/components/layout'

<Section background="cream">
  <Container>
    <h2>Section Title</h2>
    <p>Section content</p>
  </Container>
</Section>
```

**Backgrounds:**
- **Cream**: Brand cream (#FAF7F2)
- **White**: Pure white
- **Brown**: Brand brown (#2C1810) with white text
- **None**: Transparent

---

### MainLayout

Root layout with header, main content area, and footer.

**Location:** `src/layouts/MainLayout.tsx`

**Features:**
- Flex column layout
- Sticky header
- Growing main content area
- Footer at bottom
- Cream background

**Usage:**
```tsx
import { Outlet } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

// In router configuration
<Route element={<MainLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop />} />
  {/* More routes */}
</Route>

// Or wrap App
<MainLayout>
  <YourAppContent />
</MainLayout>
```

---

## 🎯 Component Patterns

### Form with Validation

```tsx
import { useState } from 'react'
import { Input, Button } from '@/components/common'

function ContactForm() {
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation logic
    if (!formData.name) {
      setErrors({ ...errors, name: 'Name is required' })
      return
    }
    // Submit form
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />
      <Button type="submit" fullWidth>
        Submit
      </Button>
    </form>
  )
}
```

### Loading State Pattern

```tsx
import { LoadingSpinner, Card } from '@/components/common'

function ProductList({ loading, products }) {
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-600 mt-4">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} hover>
          {/* Product content */}
        </Card>
      ))}
    </div>
  )
}
```

### Modal Confirmation Pattern

```tsx
import { useState } from 'react'
import { Modal, Button } from '@/components/common'

function DeleteButton({ onDelete }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    onDelete()
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Delete">
        <p className="mb-4">Are you sure you want to delete this item?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

---

## 🎨 Design Tokens

### Colors

```css
/* Brand Colors */
brand-cream: #FAF7F2
brand-beige: #F5F0E8
[#292D08]: #2C1810 (primary text, dark)
brand-brown-800: #3D2817 (accent, buttons)
brand-brown-600: #4A3425
brand-brown-300: #D4C5B0 (borders)
brand-brown-200: #E8DED0
brand-brown-100: #F5F0E8
brand-brown-50: #FAF7F2
brand-gold-600: #B8860B
brand-gold-500: #DAA520 (CTAs, highlights)
```

### Typography

```css
/* Font Families */
font-heading: 'Playfair Display', serif
font-hindi: 'Noto Serif Devanagari', serif
font-body: 'Inter', sans-serif
```

### Spacing

```css
/* Consistent spacing scale */
py-12: 3rem (48px) - Section padding mobile
py-16: 4rem (64px) - Section padding tablet
py-20: 5rem (80px) - Section padding desktop
```

---

## 🚀 Best Practices

1. **Always use TypeScript** - Leverage type safety for props
2. **Compose components** - Build complex UIs from simple components
3. **Keep components small** - Single responsibility principle
4. **Use semantic HTML** - Proper tags for accessibility
5. **Consistent spacing** - Use Tailwind spacing scale
6. **Mobile-first** - Design for mobile, enhance for desktop
7. **Test interactions** - Button clicks, form submissions, modals
8. **Document props** - Clear prop types and descriptions
9. **Handle edge cases** - Empty states, errors, loading
10. **Optimize imports** - Use index files for cleaner imports

---

## 📝 Adding New Components

1. **Create component file** in appropriate directory
2. **Define TypeScript interface** for props
3. **Use forwardRef** if the component wraps an input/button
4. **Add to index.ts** for easy imports
5. **Document in this file** with usage examples
6. **Test all variants** and edge cases

---

## 🔗 Related Documentation

- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Frontend README](./README.md)
- [Tailwind Config](./tailwind.config.js)

---

**Last Updated:** Task #3 Complete
**Components:** 11 total (6 common + 5 layout)
