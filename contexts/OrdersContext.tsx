import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { CartItem } from "@/contexts/CartContext";
import {
  Order,
  OrderItem,
  OrderStatus,
  orderService,
} from "@/services/orderService";

const PREPARING_DURATION_MS = 20000;

export interface OrdersContextValue {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => Order;
  confirmDelivery: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const generateOrderId = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BP-${random}`;
};

const todayIso = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => orderService.listOrders());
  const scheduledRef = useRef<Map<string, OrderStatus>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const addOrder = useCallback((cartItems: CartItem[], total: number): Order => {
    const items: OrderItem[] = cartItems.map(({ product, quantity }) => ({
      product,
      quantity,
    }));
    const newOrder: Order = {
      id: generateOrderId(),
      createdAt: todayIso(),
      status: "preparing",
      items,
      total,
    };
    setOrders((current) => [newOrder, ...current]);
    return newOrder;
  }, []);

  const confirmDelivery = useCallback((orderId: string) => {
    const existingTimer = timersRef.current.get(orderId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(orderId);
    }
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: "delivered" } : order,
      ),
    );
  }, []);

  // Avança automaticamente apenas de "preparing" para "in_transit" após 15s.
  // De "in_transit" para "delivered" só acontece quando o usuário confirma manualmente.
  useEffect(() => {
    orders.forEach((order) => {
      const lastStatus = scheduledRef.current.get(order.id);
      if (lastStatus === order.status) return;
      scheduledRef.current.set(order.id, order.status);

      const existingTimer = timersRef.current.get(order.id);
      if (existingTimer) {
        clearTimeout(existingTimer);
        timersRef.current.delete(order.id);
      }

      if (order.status === "preparing") {
        const timer = setTimeout(() => {
          setOrders((current) =>
            current.map((o) =>
              o.id === order.id ? { ...o, status: "in_transit" } : o,
            ),
          );
        }, PREPARING_DURATION_MS);
        timersRef.current.set(order.id, timer);
      }
    });
  }, [orders]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, confirmDelivery }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}

export { OrdersContext };
