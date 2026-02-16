import { supabaseClient } from "@/lib";
import { appError } from "@/lib/errors";

export type OrdersStatsRpcResult = {
  delivered_by_day: number[];
  delivered_total: number;
  delivered_customers: number;
  delivered_customers_by_day: number[];
  canceled_by_day: number[];
  canceled_total: number;
};

export async function getOrdersStatsRpc(
  startIso: string,
  endIso: string
): Promise<OrdersStatsRpcResult> {
  const { data, error } = await supabaseClient.rpc("get_orders_stats_7d", {
    start_iso: startIso,
    end_iso: endIso,
  });

  if (error) {
    console.error("ordersStatsRepository.getOrdersStatsRpc error:", error.message);
    throw appError("INTERNAL", "Failed to load order stats.");
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    throw appError("INTERNAL", "Invalid order stats response.");
  }
  return row as OrdersStatsRpcResult;
}
