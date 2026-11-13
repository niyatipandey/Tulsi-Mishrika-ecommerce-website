# Homepage Documentation

## Overview

The Tulsi Mishrika homepage is designed to be a modern, elegant, and conversion-focused landing page that showcases the brand's traditional values while maintaining a contemporary aesthetic.

## Design Philosophy

### Visual Style
- **Clean & Modern**: Minimalist design with ample whitespace
- **Warm & Inviting**: Cream, beige, and brown color palette
- **Traditional Meets Modern**: Devanagari script paired with modern typography
- **Luxury Feel**: Gold accents and elegant serif fonts

### Color Palette
- **Primary**: Brown Dark (#2C1810) - Headers and primary text
- **Secondary**: Brown Medium (#3D2817) - Body text
- **Accent**: Gold (#DAA520) - CTAs and highlights
- **Background**: Cream Light (#FAF7F2) - Soft, warm backgrounds
- **White**: Clean sections and cards

## Page Structure

### 1. Hero Section

**Purpose**: Capture attention and communicate core value proposition

**Elements:**
- **Left Column:**
  - Badge: "100% Natural & Pure" (gold background)
  - Hindi Title: "तुलसी मिश्रिका" (large serif, bold)
  - English Subtitle: "The Pure Essence of Traditional Crystal Sugar"
  - Description paragraph explaining the product
  - Two CTAs: "Shop Now" (primary) and "Our Story" (outline)
  - Trust indicators: 100% Natural, 500+ Customers, 4.9★ Rating

- **Right Column:**
  - Hero image with floating animation
  - Glowing gold backdrop effect
  - Drop shadow for depth

**Responsive Design:**
- Desktop: 2-column grid (50/50 split)
- Mobile: Stacked layout (image first, content second)

**Animations:**
- Hero image: Floating animation (3s infinite)
- Text: Fade-in on load

### 2. Features Section

**Purpose**: Communicate key differentiators

**Layout**: 3-column grid (stacks to 1 column on mobile)

**Features:**
1. **100% Pure & Natural**
   - Icon: Checkmark in gold circle
   - Description: No artificial additives

2. **Traditional Methods**
   - Icon: Clock in gold circle
   - Description: Centuries-old techniques

3. **Made with Love**
   - Icon: Heart in gold circle
   - Description: Carefully crafted

**Styling:**
- White background
- Gold icon containers (10% opacity background)
- Centered text alignment
- Hover effects on cards

### 3. About Section

**Purpose**: Build trust and tell brand story

**Layout**: 2-column grid (image + content)

**Elements:**
- **Left Column:**
  - Square aspect ratio container
  - Placeholder for brand/product imagery
  - Decorative gold blur circles (top-right, bottom-left)
  - White rounded background with shadow

- **Right Column:**
  - "About Us" label (gold, uppercase)
  - Heading: "Tradition Meets Purity in Every Crystal"
  - Two paragraphs about the brand story
  - CTA: "Read Our Full Story" (outline button)

**Background**: Cream light

**Responsive**: Stacks on mobile (image on top)

### 4. Featured Products Section

**Purpose**: Showcase product catalog

**Elements:**
- Section header with "Our Products" label
- Heading: "Featured Collection"
- Description paragraph
- Product grid (4 columns, responsive)
- Uses `useFeaturedProducts(4)` hook to fetch products
- Loading spinner during fetch
- "View All Products" CTA button

**Product Display:**
- ProductCard components (reusable)
- Shows product image, name, price, stock
- Links to product detail pages

**Background**: White

**Responsive:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

### 5. Benefits Section

**Purpose**: Highlight health benefits and value propositions

**Layout**: 4-column grid (stacks to 2 on tablet, 1 on mobile)

**Benefits:**
1. **Boosts Immunity** - Star icon
2. **Heart Healthy** - Heart icon
3. **Energy Boost** - Lightning icon
4. **Digestive Aid** - Checkmark icon

**Styling:**
- Card components with hover shadows
- Gold icon circles
- Centered layout
- Brief descriptions

**Background**: Cream light

### 6. Testimonials Section

**Purpose**: Build social proof and trust

**Layout**: 3-column grid (stacks on mobile)

**Testimonial Cards:**
Each includes:
- 5-star rating (gold stars)
- Customer quote (italic text)
- Customer avatar (initials in gold circle)
- Customer name and city

**Testimonials:**
1. **Priya Sharma** (Mumbai) - Quality & authenticity
2. **Rajesh Kumar** (Delhi) - Health benefits
3. **Anita Mehta** (Bangalore) - Service & delivery

**Background**: White

### 7. Call-to-Action Section

**Purpose**: Final conversion push

**Elements:**
- Heading: "Experience Pure Tradition Today"
- Description paragraph
- Two CTAs:
  - "Start Shopping" (primary, with cart icon)
  - "Contact Us" (outline, white border)

**Background**: Brown dark (high contrast)

**Text Color**: White and cream light

**Styling:**
- Centered content
- Max-width container for readability
- Large, bold typography

## Typography

### Font Hierarchy

**Headlines (H1):**
- Font: Playfair Display (serif)
- Size: 5xl - 7xl (responsive)
- Weight: Bold
- Color: Brown dark
- Usage: Main hero title, section headers

**Subheadings (H2):**
- Font: Playfair Display (serif)
- Size: 4xl - 5xl (responsive)
- Weight: Bold
- Color: Brown dark
- Usage: Section titles

**Body (H3):**
- Font: Playfair Display (serif)
- Size: xl - 2xl
- Weight: Semibold
- Color: Brown dark
- Usage: Card titles, feature headers

**Paragraphs:**
- Font: Inter (sans-serif)
- Size: base - lg
- Weight: Regular
- Color: Brown medium
- Line height: Relaxed
- Usage: All body text

**Labels:**
- Font: Inter (sans-serif)
- Size: sm
- Weight: Semibold
- Color: Gold
- Transform: Uppercase
- Letter spacing: Wide
- Usage: Section labels

**Hindi Text:**
- Font: Noto Serif Devanagari
- Size: 2xl - 3xl (hero)
- Weight: Bold
- Color: Brown dark
- Usage: Brand name, Hindi content

## Color Usage

### Primary Colors
- **Brown Dark (#2C1810)**: Main headings, important text
- **Brown Medium (#3D2817)**: Body text, descriptions
- **Gold (#DAA520)**: CTAs, accents, icons, highlights

### Background Colors
- **Cream Light (#FAF7F2)**: Alternate sections, soft backgrounds
- **White (#FFFFFF)**: Main sections, cards
- **Brown Dark (#2C1810)**: Final CTA section (inverted)

### Accent Usage
- **Gold/10**: Icon backgrounds (10% opacity)
- **Gold/20**: Decorative blur effects (20% opacity)

## Spacing & Layout

### Section Padding
- Vertical: py-16 (4rem top/bottom)
- Hero section: py-12 md:py-20 (larger on desktop)
- CTA section: py-20 (5rem top/bottom)

### Container Widths
- Default: max-w-7xl (1280px)
- Centered content: max-w-3xl (768px) for readability

### Grid Gaps
- Default: gap-8 (2rem)
- Product grid: gap-6 (1.5rem)
- Small grids: gap-4 (1rem)

### Border Radius
- Cards: rounded-lg (0.5rem)
- Buttons: rounded-lg (0.5rem)
- Icons: rounded-full (circle) or rounded-2xl (large)
- Images: rounded-3xl (1.5rem)

## Animations

### Float Animation
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

**Usage:** Hero image floating effect (3s duration, infinite)

### Hover Effects
- **Cards**: `hover:shadow-xl` - Subtle shadow lift
- **Buttons**: Background color transitions
- **Product cards**: Image scale on hover (scale-105)

### Loading States
- **Products**: Spinning loader (rotate animation)
- Duration: Smooth, natural timing

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layouts
- Stacked hero section (image on top)
- Full-width CTAs
- Reduced font sizes
- Reduced spacing

### Tablet (640px - 1024px)
- 2-column grids for products
- Maintained hero 2-column layout
- Medium font sizes

### Desktop (> 1024px)
- 3-4 column grids
- Side-by-side hero layout
- Full spacing and typography
- Maximum content width

## Component Integration

### ProductCard
- Imported from `@/components/product`
- Used in Featured Products section
- Shows product image, name, price, weight
- Links to product detail page
- Stock status indicators

### Button
- Imported from `@/components/common`
- Variants: primary, outline
- Sizes: lg (large for CTAs)
- With/without icons

### Card
- Imported from `@/components/common`
- Used for testimonials and benefits
- Hover effect enabled
- Flexible padding

### Container & Section
- Imported from `@/components/layout`
- Container: Centers content, max-width
- Section: Manages background colors and padding

## Data Integration

### Featured Products
```typescript
const { products, loading } = useFeaturedProducts(4);
```

**Hook:** `useFeaturedProducts(limit)`
**Source:** `@/hooks/useProducts`
**Data:** Fetches from Supabase `products` table
**Limit:** 4 products shown
**Sorting:** Newest first

**Loading State:**
- Shows spinner while fetching
- Graceful fallback

## SEO Considerations

### Headings
- Proper H1 hierarchy (only one H1: main hero title)
- H2 for section titles
- H3 for card/feature titles

### Content
- Descriptive, keyword-rich text
- "Traditional crystal sugar", "Mishri", "Pure", "Natural"
- Location mentions (appeals to Indian market)

### Images
- Alt text for hero image
- Descriptive product images (via ProductCard)

### Links
- Internal navigation to /shop, /story, /contact
- Clear call-to-action text

## Performance Optimization

### Image Loading
- Hero image: Preloaded (in assets)
- Product images: Lazy loaded via ProductCard
- Optimized file sizes

### Code Splitting
- Components imported from index files
- React Router code splitting (per route)

### Bundle Size
- Zustand: Lightweight state management
- Tailwind: Purged unused CSS in production

## Accessibility

### Semantic HTML
- Proper heading hierarchy
- Section elements for major blocks
- Nav elements for navigation

### ARIA
- Descriptive button text
- Icon buttons with labels
- Link text that makes sense out of context

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus states

### Color Contrast
- Brown dark on cream: WCAG AA compliant
- White on brown dark: High contrast
- Gold accents: Meets accessibility standards

## Testing Checklist

- [ ] Hero section displays correctly on all screen sizes
- [ ] Floating animation works smoothly
- [ ] Featured products load from Supabase
- [ ] All CTAs link to correct pages
- [ ] Responsive grid layouts stack properly on mobile
- [ ] Testimonial cards display correctly
- [ ] All images have alt text
- [ ] Typography scales appropriately
- [ ] Color contrast meets WCAG standards
- [ ] Hover effects work on all interactive elements

## Future Enhancements

- [ ] Video background in hero section
- [ ] Animated counter for stats (500+ customers)
- [ ] Image carousel for testimonials
- [ ] Instagram feed integration
- [ ] Newsletter signup form
- [ ] Live chat widget
- [ ] Product quick-view modals
- [ ] Parallax scrolling effects
- [ ] Blog/articles section
- [ ] Press mentions section

## Related Documentation

- [Components Documentation](./COMPONENTS.md)
- [Products Documentation](./PRODUCTS.md)
- [Routing Documentation](./ROUTING.md)
- [Design System](./README.md)

---

**Last Updated:** Task #8 Complete
**Status:** Production-ready homepage with modern design and traditional aesthetics
