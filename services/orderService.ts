/**
 * Serviço de pedidos — Billy Pet
 * Dados mockados. Futuramente: chamadas à API.
 */

import { Product, productService } from "@/services/productService";

export type OrderStatus = "delivered" | "in_transit" | "preparing" | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

const findProduct = (id: string): Product => {
  const product = productService.findById(id);
  if (!product) {
    throw new Error(`Produto mock não encontrado: ${id}`);
  }
  return product;
};

const buildOrder = (
  id: string,
  createdAt: string,
  status: OrderStatus,
  rawItems: { productId: string; quantity: number }[],
): Order => {
  const items: OrderItem[] = rawItems.map(({ productId, quantity }) => ({
    product: findProduct(productId),
    quantity,
  }));
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  return { id, createdAt, status, items, total };
};

const ORDERS: Order[] = [
  buildOrder("BP-1042", "2026-04-08", "delivered", [
    { productId: "p1", quantity: 1 },
    { productId: "p5", quantity: 2 },
  ]),
  buildOrder("BP-1031", "2026-04-02", "delivered", [
    { productId: "p3", quantity: 1 },
    { productId: "p7", quantity: 2 },
  ]),
  buildOrder("BP-1027", "2026-03-28", "delivered", [
    { productId: "p4", quantity: 1 },
  ]),
  buildOrder("BP-1019", "2026-03-25", "delivered", [
    { productId: "p2", quantity: 3 },
    { productId: "p8", quantity: 1 },
  ]),
  buildOrder("BP-1004", "2026-03-22", "cancelled", [
    { productId: "p6", quantity: 1 },
  ]),
];

export const orderService = {
  listOrders(): Order[] {
    return ORDERS;
  },
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  delivered: "Entregue",
  in_transit: "A caminho",
  preparing: "Preparando",
  cancelled: "Cancelado",
};
