import { supabaseClient } from "@/lib";
import { appError } from "@/lib/errors";

/** Minimal row for delivered-in-range: used to aggregate by day and distinct customers. */
export type DeliveredRow = { updated_at: string; customer_name: string };

/** Minimal row for canceled-in-range: used to aggregate by day. */
export type CanceledRow = { updated_at: string };

/**
 * Fetches only updated_at and customer_name for orders delivered in the given range.
 * Service aggregates into deliveredByDay, deliveredTotal, deliveredCustomers, deliveredCustomersByDay.
 */
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

/**
 * Fetches only updated_at for orders canceled in the given range.
 * Service aggregates into canceledByDay and canceledTotal.
 */
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
