import type { OrderStats } from "@/types";
import { getOrdersStatsRpc } from "@/repositories/orders-stats-repository";

const DAY_MS = 24 * 60 * 60 * 1000;

function getLast7DaysBounds(): {
  start: Date;
  end: Date;
  startIso: string;
  endIso: string;
  labels: string[];
} {
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const end = new Date(todayStart.getTime() + DAY_MS - 1);
  const start = new Date(todayStart.getTime() - 6 * DAY_MS);

  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getTime() + i * DAY_MS);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }

  return {
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    labels,
  };
}

export async function getOrdersStats(): Promise<OrderStats> {
  const { startIso, endIso, labels } = getLast7DaysBounds();
  const rpc = await getOrdersStatsRpc(startIso, endIso);

  return {
    deliveredByDay: rpc.delivered_by_day,
    deliveredTotal: rpc.delivered_total,
    deliveredCustomers: rpc.delivered_customers,
    deliveredCustomersByDay: rpc.delivered_customers_by_day,
    canceledByDay: rpc.canceled_by_day,
    canceledTotal: rpc.canceled_total,
    last7DaysLabels: labels,
  };
}
