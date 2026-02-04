/**
 * Order types matching the database schema.
 */

export const ORDER_STATUS = [
  "CREATED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];

export interface Order {
  id: number;
  product_name: string;
  customer_name: string;
  delivery_address: string;
  quantity: number;
  price_per_item: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

/** Inferred from schemas/order (single source of truth). */
export type { OrderInsert, OrderUpdate } from "@/schemas/order";
