import { supabaseClient } from "@/lib";
import type { Order } from "@/types";
import type { OrderInsert, OrderUpdate } from "@/types";
import { appError } from "@/lib/errors";

const SUPABASE_NO_ROWS = "PGRST116";

function supabaseErrorToAppError(
  context: string,
  err: { message: string; code?: string }
): never {
  const code = err.code === SUPABASE_NO_ROWS ? "NOT_FOUND" : "INTERNAL";
  const message = code === "NOT_FOUND" ? `${context} not found.` : `Failed to ${context}.`;
  console.error(`ordersRepository ${context} error:`, err.message, err.code);
  throw appError(code, message);
}

export const ordersRepository = {
  async getById(id: number): Promise<Order> {
    const { data, error } = await supabaseClient
      .from("orders")
      .select()
      .eq("id", id)
      .single();

    if (error) supabaseErrorToAppError("get order", error);
    return data as Order;
  },

  async list(): Promise<Order[]> {
    const { data, error } = await supabaseClient
      .from("orders")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ordersRepository.list error:", error.message, (error as { code?: string }).code);
      throw appError("INTERNAL", "Failed to load orders.");
    }

    return (data ?? []) as Order[];
  },

  async listPaginated(
    page: number,
    pageSize: number
  ): Promise<{ data: Order[]; total: number }> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseClient
      .from("orders")
      .select("*", { count: "exact", head: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("ordersRepository.listPaginated error:", error.message);
      throw appError("INTERNAL", "Failed to load orders.");
    }

    return {
      data: (data ?? []) as Order[],
      total: count ?? 0,
    };
  },

  async create(payload: OrderInsert): Promise<Order> {
    const { data, error } = await supabaseClient
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("ordersRepository.create error:", error.message, (error as { code?: string }).code);
      throw appError("INTERNAL", "Failed to create order.");
    }

    return data as Order;
  },

  async update(id: number, changes: OrderUpdate): Promise<Order> {
    const { data, error } = await supabaseClient
      .from("orders")
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) supabaseErrorToAppError("update order", error as { message: string; code?: string });
    return data as Order;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabaseClient.from("orders").delete().eq("id", id);

    if (error) {
      console.error("ordersRepository.delete error:", error.message);
      throw appError("INTERNAL", "Failed to delete order.");
    }
  },
};
