import { Link } from 'react-router-dom';
import { Button } from '@/components/common';

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      {/* Empty Cart Icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cream-light mb-6">
        <svg
          className="w-12 h-12 text-brown-light"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-serif font-bold text-brown-dark mb-2">
        Your cart is empty
      </h2>
      <p className="text-brown-medium mb-8 max-w-md mx-auto">
        Looks like you haven't added any products to your cart yet.
        Start shopping to fill it up!
      </p>

      {/* Action Button */}
      <Link to="/shop">
        <Button variant="primary" size="lg">
          Browse Products
        </Button>
      </Link>
    </div>
  );
}
