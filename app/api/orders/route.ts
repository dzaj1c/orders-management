import { NextResponse } from "next/server";
import { listOrders, listOrdersPaginated, createOrder } from "@/services/orders";
import { withApiErrorHandler } from "@/lib/apiError";

async function getOrders(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  if (page != null && pageSize != null) {
    const { orders, total } = await listOrdersPaginated(page, pageSize);
    return NextResponse.json({ orders, total });
  }

  const orders = await listOrders();
  return NextResponse.json(orders);
}

async function postOrder(request: Request) {
  const body = await request.json();
  const order = await createOrder(body);
  return NextResponse.json(order);
}

export const GET = withApiErrorHandler(getOrders);
export const POST = withApiErrorHandler(postOrder);
