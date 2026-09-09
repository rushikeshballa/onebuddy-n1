import { Order, OrderStatus, DeliverySlot, PaymentMethod } from '../types/order.types';
import { CartItem } from '../types/cart.types';
import { Address } from '../types/user.types';
import { mockOrders } from '../data/orders';
import { storageHelper, STORAGE_KEYS } from '../utils/helpers';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const stored = await storageHelper.getItem<Order[]>(STORAGE_KEYS.USER_ORDERS);
    if (stored && stored.length > 0) {
      return stored;
    }
    await storageHelper.setItem(STORAGE_KEYS.USER_ORDERS, mockOrders);
    return mockOrders;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId) || null;
  },

  async createOrder(params: {
    userId: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
    deliveryAddress: Address;
    deliverySlot: DeliverySlot;
    paymentMethod: PaymentMethod;
  }): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: newOrderId,
      userId: params.userId,
      items: params.items.map((ci) => ({
        id: `oi_${Math.random().toString(36).substr(2, 9)}`,
        productId: ci.product.id,
        productName: ci.product.name,
        productImage: ci.product.image,
        unit: ci.product.unit,
        price: ci.product.price,
        discountPrice: ci.product.discountPrice,
        quantity: ci.quantity,
      })),
      subtotal: params.subtotal,
      discount: params.discount,
      deliveryFee: params.deliveryFee,
      tax: params.tax,
      total: params.total,
      status: 'placed',
      deliveryAddress: params.deliveryAddress,
      deliverySlot: params.deliverySlot,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: `${params.deliverySlot.date}, ${params.deliverySlot.startTime} - ${params.deliverySlot.endTime}`,
      trackingSteps: [
        {
          status: 'placed',
          title: 'Order Placed',
          description: 'Your order has been received by 1Buddy',
          time: 'Just now',
          completed: true,
        },
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          description: 'Store is confirming your items',
          completed: false,
        },
        {
          status: 'preparing',
          title: 'Packing',
          description: 'Gathering fresh items',
          completed: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Delivery partner assigned',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Handed over at doorstep',
          completed: false,
        },
      ],
    };

    const existingOrders = await this.getOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    await storageHelper.setItem(STORAGE_KEYS.USER_ORDERS, updatedOrders);

    return newOrder;
  },
};
