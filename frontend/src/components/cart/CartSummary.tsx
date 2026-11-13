import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/common';

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout?: () => void;
  checkoutDisabled?: boolean;
}

export function CartSummary({
  subtotal,
  totalItems,
  onCheckout,
  checkoutDisabled = false,
}: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Shipping calculation (free above ₹500)
  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 50;
  const total = subtotal + shippingCost;

  return (
    <Card className="sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-serif font-bold text-brown-dark mb-4">
          Order Summary
        </h2>

        {/* Summary Lines */}
        <div className="space-y-3 mb-4 pb-4 border-b border-brown-light/20">
          <div className="flex justify-between text-brown-medium">
            <span>
              Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-brown-medium">
            <span>Shipping</span>
            <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>

          {/* Free shipping progress */}
          {subtotal < shippingThreshold && (
            <div className="pt-2">
              <p className="text-sm text-brown-medium mb-2">
                Add {formatPrice(shippingThreshold - subtotal)} more for free shipping
              </p>
              <div className="w-full bg-cream-light rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-300"
                  style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-lg font-semibold text-brown-dark">Total</span>
          <span className="text-2xl font-bold text-brown-dark">{formatPrice(total)}</span>
        </div>

        {/* Checkout Button */}
        {onCheckout ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onCheckout}
            disabled={checkoutDisabled}
            className="w-full mb-3"
          >
            Proceed to Checkout
          </Button>
        ) : (
          <Link to="/checkout">
            <Button variant="primary" size="lg" className="w-full mb-3" disabled={checkoutDisabled}>
              Proceed to Checkout
            </Button>
          </Link>
        )}

        <Link to="/shop">
          <Button variant="outline" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>

        {/* Security Badge */}
        <div className="mt-6 pt-6 border-t border-brown-light/20">
          <div className="flex items-center gap-2 text-sm text-brown-medium">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure checkout powered by Supabase</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
