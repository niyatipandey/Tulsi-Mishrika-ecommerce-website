import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, LoadingSpinner, ErrorRetry } from '@/components/common';
import { ProductCard } from '@/components/product';
import { useFeaturedProducts } from '@/hooks/useProducts';

const heroImage = '/hero-image.png';

/* ---------- small helpers ---------- */

interface ArrowRightProps {
  className?: string;
}

const ArrowRight = ({ className = 'w-4 h-4 ml-2' }: ArrowRightProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// Thin line + diamond divider used under headings (as in the reference)
interface OrnamentDividerProps {
  className?: string;
}

const OrnamentDivider = ({ className = '' }: OrnamentDividerProps) => (
  <div className={`flex items-center gap-2 text-gold ${className}`} aria-hidden="true">
    <span className="h-px w-8 bg-gold/60" />
    <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
    <span className="h-px w-8 bg-gold/60" />
  </div>
);

// Circular outlined icon badge
interface IconRingProps {
  size?: 'lg' | 'sm';
  children: ReactNode;
}

const IconRing = ({ size = 'lg', children }: IconRingProps) => (
  <div
    className={`mx-auto flex items-center justify-center rounded-full border border-gold/70 text-brown-dark ${
      size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'
    }`}
  >
    <svg
      className={size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  </div>
);

const icons: Record<string, ReactNode> = {
  leaf: <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c3-5 6-8 10-10" />,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10zM7 11h2l1.5-2 2 4 1.5-2h3" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4" />,
  sprout: <path d="M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-3 2-5 6-5 0 3-2 5-6 5z" />,
  hands: <path d="M4 14l4-4 4 3 4-3 4 4-8 6-8-6zM8 10l4-5 4 5" />,
  noChem: <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M4 4l16 16" />,
  mineral: <path d="M12 3l7 5-3 11H8L5 8l7-5zM5 8h14M12 3v16" />,
};

const trustItems = [
  { icon: 'leaf', title: '100% Natural', note: 'No Added Chemicals' },
  { icon: 'heart', title: 'Rich in Minerals', note: 'Good for Health' },
  { icon: 'drop', title: 'Lower Glycemic Index', note: 'A Better Choice' },
  { icon: 'shield', title: 'Premium Quality', note: 'Pure & Authentic' },
  { icon: 'sprout', title: 'Made with Tulsi', note: 'For a Healthier You' },
];

const specialtyItems = [
  { icon: 'sprout', label: 'Pure & Natural' },
  { icon: 'mineral', label: 'Rich in Minerals' },
  { icon: 'noChem', label: 'No Added Chemicals' },
  { icon: 'hands', label: 'Traditional Crafted' },
];

/* ---------- page ---------- */

export default function Home() {
  const { products, loading, error, refetch } = useFeaturedProducts(4);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-cream-light">
        {/* warm glow behind the product */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream-light via-cream-light/80 to-gold/20" />
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-gold/25 blur-3xl" />

        <Container>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-12 md:py-20">
            {/* Left copy */}
            <div className="order-2 lg:order-1">
              <p className="text-sm tracking-[0.3em] text-brown-dark font-semibold mb-4">MADHU वन</p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-brown-dark leading-tight">
                MADHU वन
              </h1>
              <p className="flex items-center gap-3 text-brown-medium text-lg mt-1 mb-8">
                <span className="h-px w-8 bg-gold/70" />
                मिश्री की शुद्ध पहचान
                <span className="h-px w-8 bg-gold/70" />
              </p>

              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-brown-dark leading-snug mb-4">
                Pure Sweetness
                <br />
                of Tradition
              </h2>
              <p className="text-brown-medium text-lg leading-relaxed max-w-md mb-8">
                Handcrafted Kunja Mishri, made with the goodness of nature and the blessings of Tulsi.
              </p>

              <Link to="/shop" className="inline-block">
                <Button variant="primary" size="lg" className="w-full sm:w-auto cursor-pointer">
                  Shop Now
                  <ArrowRight />
                </Button>
              </Link>
            </div>

            {/* Right image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <img
                src={heroImage}
                alt="MADHU वन Kunja Mishri"
                className="relative w-full max-w-md lg:max-w-xl drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="bg-cream-light border-t border-gold/20">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 py-8 gap-y-8">
            {trustItems.map((item, i) => (
              <div
                key={item.title}
                className={`text-center px-4 ${i > 0 ? 'md:border-l md:border-gold/30' : ''}`}
              >
                <IconRing>{icons[item.icon]}</IconRing>
                <h3 className="mt-3 font-serif font-semibold text-brown-dark">{item.title}</h3>
                <p className="text-xs text-brown-medium mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Our speciality ===== */}
      <section className="relative bg-cream-light py-12 md:py-16 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image with the signature rounded top-left / bottom-right corners */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-lg rounded-bl-lg shadow-xl bg-gold/10 flex items-center justify-center">
                <img
                  src={heroImage}
                  alt="Kunja Mishri"
                  className="w-full h-full object-contain p-6"
                />
              </div>
            </div>

            {/* Copy */}
            <div>
              <p className="text-sm tracking-[0.25em] text-gold font-semibold">OUR SPECIALITY</p>
              <OrnamentDivider className="my-3" />

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark">Kunja Mishri</h2>
              <p className="text-xl font-serif text-brown-medium mt-1 mb-5">Crystal Brown Sugar</p>

              <p className="text-brown-medium leading-relaxed max-w-md mb-6">
                A rare and traditional form of mishri, crafted in a beautiful cup shape (Kunja), known for
                its pure taste, natural sweetness and numerous health benefits.
              </p>

              <Link to="/shop" className="inline-block">
                <Button variant="outline" size="md" className="cursor-pointer">
                  Explore Our Products
                  <ArrowRight />
                </Button>
              </Link>

              <div className="grid grid-cols-2 sm:grid-cols-4 mt-8 gap-y-6">
                {specialtyItems.map((item, i) => (
                  <div
                    key={item.label}
                    className={`text-center px-2 ${i > 0 ? 'sm:border-l sm:border-gold/30' : ''}`}
                  >
                    <IconRing size="sm">{icons[item.icon]}</IconRing>
                    <p className="text-xs text-brown-medium mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== Featured products ===== */}
      {/* <Section background="white" className="py-16">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.25em] text-gold font-semibold">OUR PRODUCTS</p>
            <OrnamentDivider className="justify-center my-3" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-brown-medium max-w-2xl mx-auto">
              Discover our premium selection of traditional Mishri, each variety crafted with care.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {error && !loading && (
            <ErrorRetry
              message="Failed to load products. Please try again."
              onRetry={refetch}
            />
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center">
                <Link to="/shop" className="inline-block">
                  <Button variant="primary" size="lg" className="cursor-pointer">
                    View All Products
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </Section> */}

      {/* ===== Our story band ===== */}
      <section className="bg-brown-dark text-cream-light">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_0.8fr]">
          {/* Decorative image panel (swap in a tulsi / brass-bowl photo) */}
          <div className="relative min-h-[12rem] bg-gradient-to-br from-brown-medium to-brown-dark overflow-hidden">
            <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          </div>

          {/* Copy */}
          <div className="px-8 py-10 md:px-12">
            <h2 className="text-3xl font-serif font-semibold text-cream-light">Our Story</h2>
            <OrnamentDivider className="my-3" />
            <p className="text-cream-light/90 leading-relaxed max-w-lg mb-5">
              Born from tradition, crafted with care, MADHU वन brings you the purity of nature in every
              crystal. Our Kunja Mishri is more than just a sweetener — it&apos;s a symbol of health, heritage and
              heartfelt goodness.
            </p>
            <Link to="/story" className="inline-block">
              <Button
                variant="outline"
                size="sm"
                className="border-cream-light/70 text-cream-light hover:bg-cream-light hover:text-brown-dark cursor-pointer"
              >
                Know More
                <ArrowRight />
              </Button>
            </Link>
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center px-8 py-8 lg:border-l lg:border-cream-light/20">
            <p className="font-serif italic text-xl text-cream-light/90 text-center leading-relaxed">
              Traditional
              <br />
              Goodness
              <br />
              for a Healthier
              <br />
              Tomorrow
            </p>
          </div>
        </div>
      </section>

      {/* ===== Brand sign-off band ===== */}
      <section className="bg-cream-light border-t border-gold/30">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 py-8 text-center">
            <span className="hidden md:block h-px flex-1 bg-gold/40" />
            <div>
              <p className="text-2xl font-serif font-bold text-brown-dark">MADHU वन</p>
              <p className="text-sm text-brown-medium mt-1">मिश्री की शुद्ध पहचान</p>
            </div>
            <span className="hidden md:block w-px h-10 bg-gold/50" />
            <p className="text-xs tracking-[0.3em] text-brown-medium">
              MADHU वन · PURE SWEETNESS OF TRADITION
            </p>
            <span className="hidden md:block h-px flex-1 bg-gold/40" />
          </div>
        </Container>
      </section>
    </>
  );
}