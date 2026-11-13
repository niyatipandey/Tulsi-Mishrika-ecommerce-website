import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, Card, Input } from '@/components/common';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createOrder, type ShippingAddress } from '@/lib/orders';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 50;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address_line1.trim()) {
      newErrors.address_line1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        firstErrorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);

    try {
      // Prepare order items
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Create order
      const result = await createOrder({
        user_id: user.id,
        items: orderItems,
        shipping_address: formData,
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total,
      });

      if (result.success && result.order_id) {
        // Clear cart from store (already cleared in DB by createOrder)
        await clearCart();

// Navigate to order confirmation
        navigate(`/order-confirmation/${result.order_id}`, { replace: true });
      } else {
        alert(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      {/* Header */}
      <Section background="cream-light">
        <Container>
          <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-2">
              Checkout
            </h1>
            <p className="text-brown-medium">
              Complete your order details
            </p>
          </div>
        </Container>
      </Section>

      {/* Checkout Content */}
      <Section background="white">
        <Container>
          <form onSubmit={handlePlaceOrder} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold text-brown-dark mb-6">
                    Shipping Address
                  </h2>

                  <div className="space-y-4 scroll-mt-42" ref={firstErrorRef}>
                    {/* Full Name */}
                    <Input
                      label="Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      error={errors.full_name}
                      required
                      placeholder="Enter your full name"
                    />

                    {/* Phone */}
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      required
                      placeholder="10-digit mobile number"
                    />

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-1">
                        Address Line 1 <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        rows={2}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${
                          errors.address_line1 ? 'border-red-500' : 'border-brown-light/30'
                        }`}
                        placeholder="House no., Building name, Street"
                        required
                      />
                      {errors.address_line1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_line1}</p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <textarea
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-2 border border-brown-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="Locality, Area, Landmark"
                      />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={errors.city}
                        required
                        placeholder="City"
                      />

                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        error={errors.state}
                        required
                        placeholder="State"
                      />

                      <Input
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        error={errors.pincode}
                        required
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold text-brown-dark mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    
                    {/* Cash on Delivery */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-gold bg-gold/5'
                        : 'border-brown-light/30 hover:border-gold/50'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-brown-dark">Cash on Delivery</div>
                        <div className="text-sm text-brown-medium">
                          Pay with cash when your order arrives
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </label>
                  </div>

                  
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-brown-dark mb-4">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-brown-light/20">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-cream-light rounded flex-shrink-0">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brown-light">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-brown-dark truncate">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-brown-medium">
                            Qty: {item.quantity} × {formatPrice(item.product.price)}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-brown-dark">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-brown-light/20">
                    <div className="flex justify-between text-brown-medium">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-brown-medium">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-lg font-semibold text-brown-dark">Total</span>
                    <span className="text-2xl font-bold text-brown-dark">{formatPrice(total)}</span>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>

                  {/* Security Badge */}
                  <div className="mt-4 pt-4 border-t border-brown-light/20">
                    <div className="flex items-center gap-2 text-sm text-brown-medium">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </Container>
      </Section>
    </>
  );
}
