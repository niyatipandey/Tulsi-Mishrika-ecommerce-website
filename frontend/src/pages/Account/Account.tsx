import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, Card, Badge, LoadingSpinner } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
import { getUserOrders } from '@/lib/orders';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string | null;
    };
  }>;
}

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const { orders: fetchedOrders, error: fetchError } = await getUserOrders(user.id);

        if (fetchError) {
          setError(fetchError);
        } else {
          setOrders((fetchedOrders as Order[]) || []);
        }
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'success' | 'warning' | 'error' | 'info', label: string }> = {
      pending: { variant: 'warning', label: 'Pending' },
      confirmed: { variant: 'info', label: 'Confirmed' },
      processing: { variant: 'info', label: 'Processing' },
      shipped: { variant: 'info', label: 'Shipped' },
      delivered: { variant: 'success', label: 'Delivered' },
      cancelled: { variant: 'error', label: 'Cancelled' },
    };

    const statusInfo = statusMap[status] || { variant: 'info' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <Section background="cream-light">
        <Container>
          <div className="py-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-dark mb-2">
              My Account
            </h1>
            <p className="text-brown-medium">
              Manage your profile and orders
            </p>
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center mb-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gold">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* User Info */}
                  <h2 className="text-xl font-semibold text-brown-dark mb-1">
                    {profile?.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-brown-medium break-all">
                    {user.email}
                  </p>
                  {profile?.phone && (
                    <p className="text-sm text-brown-medium mt-1">
                      {profile.phone}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="space-y-2 mb-6">
                  <button className="w-full text-left px-4 py-2 rounded-lg bg-gold/10 text-gold font-medium">
                    Order History
                  </button>
                  {/* Future: Add more nav items
                  <button className="w-full text-left px-4 py-2 rounded-lg text-brown-medium hover:bg-cream-light transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg text-brown-medium hover:bg-cream-light transition-colors">
                    Saved Addresses
                  </button>
                  */}
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </Card>
            </div>

            {/* Main Content - Order History */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-brown-dark mb-2">
                  Order History
                </h2>
                <p className="text-brown-medium">
                  View and track all your orders
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <Card className="p-8 text-center">
                  <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold">Failed to load orders</p>
                    <p className="text-sm text-brown-medium mt-1">{error}</p>
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {!loading && !error && orders.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="text-brown-light mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-brown-dark mb-2">No Orders Yet</h3>
                    <p className="text-brown-medium mb-6">
                      You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <Link to="/shop">
                      <Button variant="primary" size="lg">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}

              {/* Orders List */}
              {!loading && !error && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link key={order.id} to={`/order-confirmation/${order.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Left Side - Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-brown-dark">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brown-medium mb-3">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(order.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>{order.order_items.length} {order.order_items.length === 1 ? 'item' : 'items'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className={order.payment_status === 'completed' ? 'text-green-600' : ''}>
                                  {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                                </span>
                              </div>
                            </div>

                            {/* Product Preview */}
                            <div className="flex items-center gap-2">
                              {order.order_items.slice(0, 3).map((item) => (
                                <div
                                  key={item.id}
                                  className="w-12 h-12 bg-cream-light rounded flex-shrink-0 overflow-hidden"
                                  title={item.products.name}
                                >
                                  {item.products.image_url ? (
                                    <img
                                      src={item.products.image_url}
                                      alt={item.products.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brown-light">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {order.order_items.length > 3 && (
                                <div className="text-sm text-brown-medium">
                                  +{order.order_items.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Side - Amount & Action */}
                          <div className="flex md:flex-col items-center md:items-end gap-3">
                            <div className="flex-1 md:flex-none text-left md:text-right">
                              <div className="text-sm text-brown-medium mb-1">Total Amount</div>
                              <div className="text-2xl font-bold text-brown-dark">
                                {formatPrice(order.total_amount)}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <svg className="w-6 h-6 text-brown-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
