import { NextResponse } from "next/server";
import {
  getOrderById,
  updateOrder,
  deleteOrder,
} from "@/services/orders";
import { appError } from "@/lib/errors";
import { withApiErrorHandler } from "@/lib/apiError";

async function parseId(context: { params?: Promise<Record<string, string>> } | undefined) {
  const params = context?.params ? await context.params : undefined;
  const id = params?.id;
  if (id == null) return null;
  const idNum = Number(id);
  if (Number.isNaN(idNum)) return null;
  return idNum;
}

async function getOrder(
  _request: Request,
  context?: { params?: Promise<Record<string, string>> }
) {
  const idNum = await parseId(context);
  if (idNum === null) throw appError("VALIDATION", "Invalid order id");
  const order = await getOrderById(idNum);
  return NextResponse.json(order);
}

async function patchOrder(
  request: Request,
  context?: { params?: Promise<Record<string, string>> }
) {
  const idNum = await parseId(context);
  if (idNum === null) throw appError("VALIDATION", "Invalid order id");
  const body = await request.json();
  const order = await updateOrder(idNum, body);
  return NextResponse.json(order);
}

async function deleteOrderById(
  _request: Request,
  context?: { params?: Promise<Record<string, string>> }
) {
  const idNum = await parseId(context);
  if (idNum === null) throw appError("VALIDATION", "Invalid order id");
  await deleteOrder(idNum);
  return new NextResponse(null, { status: 204 });
}

export const GET = withApiErrorHandler(getOrder);
export const PATCH = withApiErrorHandler(patchOrder);
export const DELETE = withApiErrorHandler(deleteOrderById);
