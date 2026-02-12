"use client";

import * as React from "react";
import { getOrdersStats as getOrdersStatsAction } from "@/app/actions/orders";
import type { OrderStats } from "@/types";

export function useOrdersStats() {
  const [stats, setStats] = React.useState<OrderStats | null>(null);

  React.useEffect(() => {
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
