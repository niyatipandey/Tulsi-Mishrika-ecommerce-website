import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, Badge, LoadingSpinner } from '@/components/common';
import { useProduct } from '@/hooks/useProducts';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice } from '@/utils/formatting';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug || '');
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem)
  const { openCartDrawer, addToast } = useUIStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product, quantity);
      addToast('success', `Added ${quantity} × ${product.name}`);
      openCartDrawer();
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToast('error', 'Could not sync cart. Your last change was reversed.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/shop/${slug}` } });
      return;
    }

    if (!product) return;

    // Add to cart and go to checkout
    setAdding(true);
    try {
      await addItem(product, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToast('error', 'Failed to add item to cart. Please try again.');
      setAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (product != null && product.stock_quantity !== null && quantity >= product.stock_quantity) {
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Section background="white">
        <Container>
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      </Section>
    );
  }

  // Error or Product Not Found
  if (error || !product) {
    return (
      <Section background="white">
        <Container>
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-brown-dark mb-2">Product Not Found</h1>
              <p className="text-brown-medium mb-6">
                {error?.message || "The product you're looking for doesn't exist."}
              </p>
              <Link to="/shop">
                <Button variant="primary">Back to Shop</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity === 0;
  const isLowStock = product.stock_quantity !== null && product.stock_quantity <= 10 && product.stock_quantity > 0;

  return (
    <Section background="white">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-brown-medium flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-brown-dark font-medium">{product.name}</span>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-cream-light rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brown-light">
                <svg
                  className="w-32 h-32"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Product Name */}
            <h1 className="text-4xl font-serif font-bold text-brown-dark mb-4">
              {product.name}
            </h1>

            {/* Stock Status Badge */}
            {isOutOfStock && (
              <Badge variant="error" size="lg" className="mb-4">
                Out of Stock
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="warning" size="lg" className="mb-4">
                Only {product.stock_quantity} left!
              </Badge>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-brown-dark">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-2xl text-brown-light line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <Badge variant="success" size="md">
                    Save {formatPrice(product.original_price - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-brown-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="bg-cream-light rounded-lg p-6 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brown-medium font-medium">Weight:</span>
                <span className="text-brown-dark font-semibold">{product.weight}g</span>
              </div>
              {product.stock_quantity !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-brown-medium font-medium">Availability:</span>
                  <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-brown-medium font-medium">SKU:</span>
                <span className="text-brown-dark font-mono text-sm">{product.id.slice(0, 8)}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-brown-dark mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-brown-light/30 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-brown-dark hover:bg-cream-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold text-brown-dark border-x border-brown-light/30">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                      className="px-4 py-2 text-brown-dark hover:bg-cream-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-brown-medium">
                    Total: {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                loading={adding}
                className="flex-1"
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={isOutOfStock || adding}
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-brown-light/30">
              <h3 className="text-lg font-semibold text-brown-dark mb-4">
                Product Information
              </h3>
              <ul className="space-y-2 text-brown-medium">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Natural and Pure Mishri</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Handcrafted with Traditional Methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free Shipping on Orders Above ₹500</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Easy Returns within 7 Days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
