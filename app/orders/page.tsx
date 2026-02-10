"use client";

import { Box } from "@mui/material";
import { pageLayout, pageContentList } from "@/styles/page-layout";
import { ErrorState } from "@/components/ui/ErrorState";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersGrid } from "@/components/orders/OrdersGrid";
import { useOrdersPage } from "./useOrdersPage";

export default function OrdersPage() {
  const { error, gridProps, handleAddOrder, isAddingRow } = useOrdersPage();

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentList}>
        <OrdersHeader onAddOrder={handleAddOrder} isAddingRow={isAddingRow} />
        {error ? (
          <ErrorState message={error} />
        ) : (
          <OrdersGrid {...gridProps} />
        )}
      </Box>
    </Box>
  );
}
