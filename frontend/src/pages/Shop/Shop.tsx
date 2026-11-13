import { useState } from 'react';
import { Container, Section } from '@/components/layout';
import { LoadingSpinner, ErrorRetry } from '@/components/common';
import { ProductCard } from '@/components/product';
import { useProducts } from '@/hooks/useProducts';

export default function Shop() {
  const { products, loading, error, refetch } = useProducts();
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <>
      {/* Header Section */}
      <Section background="cream-light">
        <Container>
          <div className="text-center py-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-4">
              Our Products
            </h1>
            <p className="text-lg text-brown-medium max-w-2xl mx-auto">
              Discover our premium collection of traditional Indian crystal sugar (Mishri).
              Handcrafted with love, naturally pure, and full of authentic flavor.
            </p>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section background="white">
        <Container>
          {/* Filters/Sort Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="text-brown-medium">
              {!loading && !error && (
                <span className="font-medium">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-brown-medium font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-brown-light/30 rounded-lg text-brown-dark bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent cursor-pointer"
                disabled={loading || !!error}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <ErrorRetry
              message="Failed to load products. Please try again."
              onRetry={refetch}
            />
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-brown-light mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-lg font-semibold text-brown-dark">No products available</p>
                <p className="text-sm text-brown-medium mt-2">
                  Check back soon for new additions to our collection.
                </p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
