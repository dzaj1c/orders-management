import { supabaseClient } from "@/lib";
import { appError } from "@/lib/errors";

export type DeliveredRow = { updated_at: string; customer_name: string };

export type CanceledRow = { updated_at: string };

export async function getDeliveredInRange(
  startIso: string,
  endIso: string
): Promise<DeliveredRow[]> {
  const { data, error } = await supabaseClient
    .from("orders")
    .select("updated_at, customer_name")
    .eq("status", "DELIVERED")
    .gte("updated_at", startIso)
    .lte("updated_at", endIso);

  if (error) {
    console.error("ordersStatsRepository.getDeliveredInRange error:", error.message);
    throw appError("INTERNAL", "Failed to load order stats.");
  }
  return (data ?? []) as DeliveredRow[];
}

export async function getCanceledInRange(
  startIso: string,
  endIso: string
): Promise<CanceledRow[]> {
  const { data, error } = await supabaseClient
    .from("orders")
    .select("updated_at")
    .eq("status", "CANCELED")
    .gte("updated_at", startIso)
    .lte("updated_at", endIso);

  if (error) {
    console.error("ordersStatsRepository.getCanceledInRange error:", error.message);
    throw appError("INTERNAL", "Failed to load order stats.");
  }
  return (data ?? []) as CanceledRow[];
}
