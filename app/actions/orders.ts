"use server";

import type { Order, OrderInsert, OrderUpdate } from "@/types";
import {
  listOrders as listOrdersService,
  listOrdersPaginated as listOrdersPaginatedService,
  getOrderById as getOrderByIdService,
  createOrder as createOrderService,
  updateOrder as updateOrderService,
  deleteOrder as deleteOrderService,
} from "@/services/orders";

export async function listOrders(): Promise<Order[]> {
  return listOrdersService();
}

export async function listOrdersPaginated(
  page: number,
  pageSize: number
): Promise<{ orders: Order[]; total: number }> {
  return listOrdersPaginatedService(page, pageSize);
}

export async function getOrderById(id: number): Promise<Order> {
  return getOrderByIdService(id);
}

export async function createOrder(data: OrderInsert): Promise<Order> {
  return createOrderService(data);
}

export async function updateOrder(
  id: number,
  data: OrderUpdate
): Promise<Order> {
  return updateOrderService(id, data);
}

export async function deleteOrder(id: number): Promise<void> {
  return deleteOrderService(id);
}
