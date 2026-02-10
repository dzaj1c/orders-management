"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { listOrdersPaginated } from "@/app/actions/orders";
import { handleResult } from "@/lib/actionResult";
import { pageLayout, pageContentList, dataGridWrapper } from "@/styles/page-layout";
import { ErrorState } from "@/components/ui/ErrorState";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersGrid } from "@/components/orders/OrdersGrid";
import { useOrderColumns } from "@/components/orders/useOrderColumns";
import type { Order } from "@/types";

const INITIAL_PAGINATION = { page: 0, pageSize: 10 };

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [paginationModel, setPaginationModel] = React.useState(INITIAL_PAGINATION);
  
  const columns = useOrderColumns();

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const result = await listOrdersPaginated(paginationModel.page, paginationModel.pageSize);
      if (!isMounted) return;
      if (handleResult(result, setError)) {
        setOrders(result.data.orders);
        setTotal(result.data.total);
      }
      setLoading(false);
    }
    load();
    return () => { isMounted = false; };
  }, [paginationModel]);

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentList}>
        <OrdersHeader />
        {error ? (
          <ErrorState message={error} />
        ) : (
          <OrdersGrid 
            orders={orders}
            total={total}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Box>
    </Box>
  );
}