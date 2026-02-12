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

export type { OrderInsert, OrderUpdate } from "@/schemas/order";

/** Stats for last 7 days only. Trend is derived from the 7-day series. */
export interface OrderStats {
  /** Delivered orders count per day (index 0 = 7 days ago, 6 = today). */
  deliveredByDay: number[];
  /** Total delivered orders in last 7 days. */
  deliveredTotal: number;
  /** Distinct customers with at least one delivery in last 7 days. */
  deliveredCustomers: number;
  /** Distinct delivered customers per day (for sparkline/trend). */
  deliveredCustomersByDay: number[];
  /** Canceled orders count per day, last 7 days. */
  canceledByDay: number[];
  /** Total canceled orders in last 7 days. */
  canceledTotal: number;
  /** x-axis labels for 7d chart (e.g. ["Apr 8", "Apr 9", ...]). */
  last7DaysLabels: string[];
}
