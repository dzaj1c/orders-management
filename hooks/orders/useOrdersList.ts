"use client";

import { useCallback, useState } from "react";
import { listOrdersPaginated } from "@/actions/orders";
import { handleResult } from "@/lib/actionResult";
import type { Order } from "@/types";

export type LoadPageResult = { data: Order[]; total: number };

export function useOrdersList() {
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (page: number, pageSize: number): Promise<LoadPageResult> => {
      try {
        const result = await listOrdersPaginated(page, pageSize);
        if (handleResult(result, setError)) {
          return { data: result.data.orders, total: result.data.total };
        }
        throw new Error(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        throw err;
      }
    },
    []
  );

  return {
    error,
    setError,
    loadPage,
  };
}
