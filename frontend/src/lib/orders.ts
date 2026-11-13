import { supabase } from './supabase';

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderParams {
  user_id: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export interface CreateOrderResult {
  success: boolean;
  order_id?: string;
  error?: string;
}

/**
 * Create a new order with order items
 */

export async function createOrder(
  params: CreateOrderParams
): Promise<CreateOrderResult> {
  try {
    if (params.payment_method !== 'cod') {
      throw new Error('Only Cash on Delivery is currently available.');
    }

    const { data, error } = await supabase.rpc('create_cod_order', {
      p_items: params.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      p_shipping_address: params.shipping_address,
      p_shipping_cost: params.shipping_cost,
    });

    if (error) {
      throw error;
    }

    if (!data?.order_id) {
      throw new Error('The order could not be created. Please try again.');
    }

    // Clear the local cart only after the order is successfully created.
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', params.user_id)
      .maybeSingle();

    if (cart) {
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);

      if (cartError) {
        console.error('Order created, but cart cleanup failed:', cartError);
      }
    }

    return {
      success: true,
      order_id: data.order_id,
    };
  } catch (error) {
    console.error('Error creating order:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create order. Please try again.',
    };
  }
}


/**
 * Get order details by ID
 */
export async function getOrderById(orderId: string) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      throw error;
    }

    return { order, error: null };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { 
      order: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch order' 
    };
  }
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId: string) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { orders, error: null };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { 
      orders: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch orders' 
    };
  }
}
