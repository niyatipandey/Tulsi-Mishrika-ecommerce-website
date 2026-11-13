import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/common';

export default function NotFound() {
  return (
    <Section background="cream-light" className="min-h-screen flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold text-gold/20 leading-none">
              404
            </h1>
          </div>

          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gold/10 rounded-full">
              <svg
                className="w-12 h-12 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-brown-medium mb-8 max-w-md mx-auto">
            Oops! It seems this crystal has dissolved. The page you're looking for doesn't exist 
            or may have been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Homepage
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Popular Links */}
          <div className="pt-12 border-t border-brown-light/30">
            <p className="text-sm text-brown-medium mb-4">Popular pages you might be looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/about" className="text-sm text-brown-medium hover:text-gold transition-colors underline">
                About Us
              </Link>
              <span className="text-brown-light">•</span>
              <Link to="/story" className="text-sm text-brown-medium hover:text-gold transition-colors underline">
                Our Story
              </Link>
              <span className="text-brown-light">•</span>
              <Link to="/contact" className="text-sm text-brown-medium hover:text-gold transition-colors underline">
                Contact
              </Link>
              <span className="text-brown-light">•</span>
              <Link to="/cart" className="text-sm text-brown-medium hover:text-gold transition-colors underline">
                Shopping Cart
              </Link>
              <span className="text-brown-light">•</span>
              <Link to="/account" className="text-sm text-brown-medium hover:text-gold transition-colors underline">
                My Account
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
