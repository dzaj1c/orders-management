/**
 * Order seeding script: periodically creates orders and advances their statuses.
 * Set ENABLE_SEEDING=true and SEED_TICK_INTERVAL_MS in .env.local.
 * Run from project root: npm run seed:orders
 */

import { config } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { OrderInsert, OrderStatus } from "@/types";

const cwd = process.cwd();
const envPath = join(cwd, ".env.local");

// Load .env.local before any Supabase/service code runs
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log("[seed] Loaded .env.local");
} else {
  console.error("[seed] .env.local not found at", envPath, "- run from project root");
  process.exit(1);
}

const ENABLE_SEEDING = process.env.ENABLE_SEEDING === "true";
const SEED_TICK_INTERVAL_MS = Math.max(
  5000,
  Number(process.env.SEED_TICK_INTERVAL_MS) || 60_000
);

console.log("[seed] ENABLE_SEEDING =", process.env.ENABLE_SEEDING, "->", ENABLE_SEEDING);
console.log("[seed] SEED_TICK_INTERVAL_MS =", SEED_TICK_INTERVAL_MS);

if (!ENABLE_SEEDING) {
  console.log("[seed] Seeding is disabled. Set ENABLE_SEEDING=true in .env.local to enable.");
  process.exit(0);
}

// Load fake data from JSON
const seedDataPath = join(cwd, "scripts", "seed-data.json");
if (!existsSync(seedDataPath)) {
  console.error("[seed] seed-data.json not found at", seedDataPath);
  process.exit(1);
}
const seedData = JSON.parse(
  readFileSync(seedDataPath, "utf-8")
) as { products: string[]; customers: string[]; addresses: string[] };

const STATUS_FLOW: OrderStatus[] = [
  "CREATED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(s);
  if (i === -1 || i === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1];
}

async function run(): Promise<void> {
  const { createOrder, listOrders, updateOrder } = await import("@/services/orders");
  const { ORDER_STATUS } = await import("@/types");

  function randomOrderInsert(): OrderInsert {
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price_per_item = Number((Math.random() * 50 + 5).toFixed(2));
    return {
      product_name: pick(seedData.products),
      customer_name: pick(seedData.customers),
      delivery_address: pick(seedData.addresses),
      quantity,
      price_per_item,
      status: pick(ORDER_STATUS),
    };
  }

  async function tick(): Promise<void> {
    try {
      const toCreate = Math.floor(Math.random() * 3);
      let created = 0;
      for (let i = 0; i < toCreate; i++) {
        const order = await createOrder(randomOrderInsert());
        created++;
        console.log("[seed] Created order", order.id);
      }

      const orders = await listOrders();
      if (orders.length === 0 && created === 0) {
        console.warn("[seed] No orders in DB and none created this tick. Check Supabase RLS and NEXT_PUBLIC_* in .env.local.");
      }
      const eligible = orders.filter((o) => nextStatus(o.status));
      const toUpdate = eligible.slice(
        0,
        1 + Math.floor(Math.random() * Math.min(3, Math.max(1, eligible.length)))
      );
      for (const o of toUpdate) {
        const next = nextStatus(o.status);
        if (!next) continue;
        await updateOrder(o.id, { status: next });
        console.log("[seed] Updated order", o.id, o.status, "->", next);
      }
    } catch (err) {
      console.error("[seed] Tick error:", err);
    }
  }

  console.log("[seed] Started. Tick interval:", SEED_TICK_INTERVAL_MS / 1000, "s");
  console.log("[seed] Running first tick...");
  await tick();
  setInterval(tick, SEED_TICK_INTERVAL_MS);
  console.log("[seed] Next tick in", SEED_TICK_INTERVAL_MS / 1000, "s (Ctrl+C to stop)");
}

run().catch((err) => {
  console.error("[seed] Fatal error:", err);
  process.exit(1);
});
