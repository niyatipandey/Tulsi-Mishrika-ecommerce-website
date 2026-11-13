import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, LoadingSpinner } from '@/components/common';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const {
    items,
    loading,
    initialized,
    initialize,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  const handleQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
    } catch {
      addToast('error', 'Could not update quantity. Your cart was restored.');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId);
      addToast('info', 'Item removed from cart');
    } catch {
      addToast('error', 'Could not remove item. Your cart was restored.');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        addToast('info', 'Cart cleared');
      } catch {
        addToast('error', 'Could not clear cart. Your items were restored.');
      }
    }
  };

  // Loading state
  if (!initialized || loading) {
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

  // Empty cart
  if (items.length === 0) {
    return (
      <Section background="white">
        <Container size="md">
          <EmptyCart />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Header Section */}
      <Section background="cream-light">
        <Container>
          <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-2">
              Shopping Cart
            </h1>
            <p className="text-brown-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </Container>
      </Section>

      {/* Cart Content */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Clear Cart Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-brown-dark">
                  Items in Cart
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  Clear Cart
                </Button>
              </div>

              {/* Cart Items List */}
              <div className="bg-white border border-brown-light/20 rounded-lg p-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Continue Shopping Link (Mobile) */}
              <div className="mt-6 lg:hidden">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/shop')}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                totalItems={totalItems}
                onCheckout={handleCheckout}
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-brown-light/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-brown-dark mb-1">100% Natural</h3>
                <p className="text-sm text-brown-medium">Pure and authentic Mishri</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-brown-dark mb-1">Secure Payment</h3>
                <p className="text-sm text-brown-medium">Your data is protected</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-brown-dark mb-1">Free Shipping</h3>
                <p className="text-sm text-brown-medium">On orders above ₹500</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
