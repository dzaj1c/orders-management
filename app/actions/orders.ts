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
import { withResult } from "@/lib/actionResult";

export async function listOrders() {
  return withResult(() => listOrdersService());
}

export async function listOrdersPaginated(page: number, pageSize: number) {
  return withResult(() => listOrdersPaginatedService(page, pageSize));
}

export async function getOrderById(id: number) {
  return withResult(() => getOrderByIdService(id));
}

export async function createOrder(data: OrderInsert) {
  return withResult(() => createOrderService(data));
}

export async function updateOrder(id: number, data: OrderUpdate) {
  return withResult(() => updateOrderService(id, data));
}

export async function deleteOrder(id: number) {
  return withResult(() => deleteOrderService(id));
}
