"use client";

import { useEffect, useState } from "react";
import { getOrdersStats as getOrdersStatsAction } from "@/app/actions/orders";
import type { OrderStats } from "@/types";

export function useOrdersStats() {
  const [stats, setStats] = useState<OrderStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    getOrdersStatsAction().then((result) => {
      if (!isMounted) return;
      if (result.success) setStats(result.data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return { stats };
}
