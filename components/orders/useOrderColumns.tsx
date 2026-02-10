import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { OrderStatus } from "@/components";
import type { Order } from "@/types";

export function useOrderColumns() {
  const router = useRouter();

  return React.useMemo<GridColDef<Order>[]>(() => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "product_name", headerName: "Product", flex: 1, minWidth: 150 },
    { field: "customer_name", headerName: "Customer", flex: 1, minWidth: 160 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 80 },
    {
      field: "price_per_item",
      headerName: "Price / item",
      type: "number",
      width: 130,
      valueFormatter: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <OrderStatus status={params.value} />,
    },
    {
      field: "created_at",
      headerName: "Created at",
      flex: 1,
      minWidth: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 140,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => router.push(`/orders/${params.row.id}`)}
        >
          View
        </Button>
      ),
    },
  ], [router]);
}