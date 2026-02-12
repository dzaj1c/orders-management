import type { OrderStats } from "@/types";
import {
  getDeliveredInRange,
  getCanceledInRange,
  type DeliveredRow,
  type CanceledRow,
} from "@/repositories/orders-stats-repository";

const DAY_MS = 24 * 60 * 60 * 1000;

function getLast7DaysBounds(): {
  start: Date;
  end: Date;
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
  return { start, end, labels };
}

function dateToDayIndex(iso: string, startMs: number): number {
  const t = new Date(iso).getTime();
  const dayIndex = Math.floor((t - startMs) / DAY_MS);
  if (dayIndex < 0 || dayIndex > 6) return -1;
  return dayIndex;
}

function aggregateDelivered(rows: DeliveredRow[], startMs: number): {
  deliveredByDay: number[];
  deliveredTotal: number;
  deliveredCustomers: number;
  deliveredCustomersByDay: number[];
} {
  const deliveredByDay = [0, 0, 0, 0, 0, 0, 0];
  const customersByDay = [0, 0, 0, 0, 0, 0, 0];
  const customersSet = new Set<string>();
  const customersPerDay = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];

  for (const r of rows) {
    const idx = dateToDayIndex(r.updated_at, startMs);
    if (idx >= 0) {
      deliveredByDay[idx]++;
      customersSet.add(r.customer_name);
      customersPerDay[idx].add(r.customer_name);
    }
  }
  for (let i = 0; i < 7; i++) customersByDay[i] = customersPerDay[i].size;

  return {
    deliveredByDay,
    deliveredTotal: rows.length,
    deliveredCustomers: customersSet.size,
    deliveredCustomersByDay: customersByDay,
  };
}

function aggregateCanceled(rows: CanceledRow[], startMs: number): {
  canceledByDay: number[];
  canceledTotal: number;
} {
  const canceledByDay = [0, 0, 0, 0, 0, 0, 0];
  for (const r of rows) {
    const idx = dateToDayIndex(r.updated_at, startMs);
    if (idx >= 0) canceledByDay[idx]++;
  }
  return {
    canceledByDay,
    canceledTotal: rows.length,
  };
}

export async function getOrdersStats(): Promise<OrderStats> {
  const { start, end, labels } = getLast7DaysBounds();
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const startMs = start.getTime();

  const [deliveredRows, canceledRows] = await Promise.all([
    getDeliveredInRange(startIso, endIso),
    getCanceledInRange(startIso, endIso),
  ]);

  const delivered = aggregateDelivered(deliveredRows, startMs);
  const canceled = aggregateCanceled(canceledRows, startMs);

  return {
    deliveredByDay: delivered.deliveredByDay,
    deliveredTotal: delivered.deliveredTotal,
    deliveredCustomers: delivered.deliveredCustomers,
    deliveredCustomersByDay: delivered.deliveredCustomersByDay,
    canceledByDay: canceled.canceledByDay,
    canceledTotal: canceled.canceledTotal,
    last7DaysLabels: labels,
  };
}
