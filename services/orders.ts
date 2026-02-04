import type { Order, OrderInsert, OrderUpdate } from "@/types";
import { orderInsertSchema, orderUpdateSchema } from "@/schemas";
import { ordersRepository } from "@/repositories";
import { appError } from "@/lib/errors";

export async function listOrders(): Promise<Order[]> {
  return ordersRepository.list();
}

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function parsePagination(
  page: string | number | null | undefined,
  pageSize: string | number | null | undefined
): { page: number; pageSize: number } {
  const pageNum = page != null ? parseInt(String(page), 10) : NaN;
  const sizeNum = pageSize != null ? parseInt(String(pageSize), 10) : NaN;
  const p = Number.isNaN(pageNum) || pageNum < 0 ? DEFAULT_PAGE : Math.floor(pageNum);
  const s =
    Number.isNaN(sizeNum) || sizeNum < 1
      ? DEFAULT_PAGE_SIZE
      : Math.min(MAX_PAGE_SIZE, Math.floor(sizeNum));
  return { page: p, pageSize: s };
}

export async function listOrdersPaginated(
  page: string | number | null | undefined,
  pageSize: string | number | null | undefined
): Promise<{ orders: Order[]; total: number }> {
  const { page: p, pageSize: s } = parsePagination(page, pageSize);
  const { data, total } = await ordersRepository.listPaginated(p, s);
  return { orders: data, total };
}

export async function getOrderById(id: number): Promise<Order> {
  return ordersRepository.getById(id);
}

export async function createOrder(data: OrderInsert): Promise<Order> {
  const parsed = orderInsertSchema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    throw appError(
      "VALIDATION",
      "Validation failed",
      flattened.fieldErrors as Record<string, string[]>
    );
  }
  return ordersRepository.create(parsed.data);
}

export async function updateOrder(
  id: number,
  data: OrderUpdate
): Promise<Order> {
  const parsed = orderUpdateSchema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    throw appError(
      "VALIDATION",
      "Validation failed",
      flattened.fieldErrors as Record<string, string[]>
    );
  }
  return ordersRepository.update(id, parsed.data);
}

export async function deleteOrder(id: number): Promise<void> {
  return ordersRepository.delete(id);
}
