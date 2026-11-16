import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, Card, LoadingSpinner } from '@/components/common';
import { getOrderById } from '@/lib/orders';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string | null;
    };
  }>;
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      const { order: fetchedOrder, error: fetchError } = await getOrderById(orderId);

      if (fetchError || !fetchedOrder) {
        setError(fetchError || 'Order not found');
      } else {
        setOrder(fetchedOrder as Order);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  // Error State
  if (error || !order) {
    return (
      <Section background="white">
        <Container size="md">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-brown-dark mb-2">Order Not Found</h1>
              <p className="text-brown-medium mb-6">{error || 'Unable to load order details'}</p>
              <Link to="/shop">
                <Button variant="primary">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Success Header */}
      <Section background="green-50" className="py-12">
        <Container size="md">
          <div className="text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-xl text-brown-medium mb-2">
              Thank you for your order
            </p>
            <p className="text-brown-medium">
              Order Number: <span className="font-mono font-semibold">{order.order_number.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
        </Container>
      </Section>

      {/* Order Details */}
      <Section background="white">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items & Delivery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-brown-dark mb-4">
                  Order Items
                </h2>

                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-brown-light/20 last:border-b-0 last:pb-0">
                      <div className="w-20 h-20 bg-cream-light rounded-lg flex-shrink-0">
                        {item.products.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brown-light">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-brown-dark mb-1">
                          {item.products.name}
                        </h3>
                        <p className="text-sm text-brown-medium mb-2">
                          {formatPrice(item.price)} each
                        </p>
                        <p className="text-sm text-brown-medium">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-brown-dark">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-brown-dark mb-4">
                  Delivery Address
                </h2>

                <div className="text-brown-medium space-y-1">
                  <p className="font-semibold text-brown-dark">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && (
                    <p>{order.shipping_address.address_line2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-brown-dark mb-4">
                  Payment Information
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brown-medium">Payment Method:</span>
                    <span className="font-semibold text-brown-dark capitalize">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-medium">Payment Status:</span>
                    <span className={`font-semibold ${
                      order.payment_status === 'completed' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-brown-dark mb-4">
                  Order Summary
                </h2>

                {/* Order Info */}
                <div className="space-y-3 mb-4 pb-4 border-b border-brown-light/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-medium">Order ID:</span>
                    <span className="font-mono font-semibold text-brown-dark">
                      {order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-medium">Order Date:</span>
                    <span className="font-semibold text-brown-dark">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-medium">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.status === 'confirmed' ? 'Confirmed' : order.status}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4 pb-4 border-b border-brown-light/20">
                  <div className="flex justify-between text-brown-medium">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-5">
                  <Link to="/account">
                    <Button variant="primary" size="lg" className="w-full mb-5">
                      View Order History
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Expected Delivery */}
                <div className="mt-6 pt-6 border-t border-brown-light/20">
                  <div className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <div>
                      <p className="font-semibold text-brown-dark mb-1">Expected Delivery</p>
                      <p className="text-brown-medium">3-5 business days</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mt-12">
            <Card className="p-8 bg-cream-light border-none">
              <h2 className="text-2xl font-serif font-bold text-brown-dark mb-6 text-center">
                What Happens Next?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-gold">1</span>
                  </div>
                  <h3 className="font-semibold text-brown-dark mb-2">Order Confirmation</h3>
                  <p className="text-sm text-brown-medium">
                    You'll receive an email with your order details shortly
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-gold">2</span>
                  </div>
                  <h3 className="font-semibold text-brown-dark mb-2">Order Processing</h3>
                  <p className="text-sm text-brown-medium">
                    We'll carefully prepare your order for shipment
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-gold">3</span>
                  </div>
                  <h3 className="font-semibold text-brown-dark mb-2">Delivery</h3>
                  <p className="text-sm text-brown-medium">
                    Your order will arrive at your doorstep in 3-5 days
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
