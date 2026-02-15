"use client";

import { useCallback, useState } from "react";
import { listOrdersPaginated } from "@/app/actions/orders";
import { handleResult } from "@/lib/actionResult";
import type { Order } from "@/types";

export type LoadPageResult = { data: Order[]; total: number };

export function useOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (page: number, pageSize: number): Promise<LoadPageResult> => {
      setLoading(true);
      try {
        const result = await listOrdersPaginated(page, pageSize);
        if (handleResult(result, setError)) {
          setOrders(result.data.orders);
          setTotal(result.data.total);
          return { data: result.data.orders, total: result.data.total };
        }
        throw new Error(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    orders,
    total,
    loading,
    error,
    setError,
    loadPage,
  };
}
