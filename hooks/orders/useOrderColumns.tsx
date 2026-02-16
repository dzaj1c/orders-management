import { useMemo } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { OrderStatus } from "@/components";
import { NEW_ROW_ID } from "@/components/ui/custom-grid";
import type { Order, OrderStatus as OrderStatusType } from "@/types";
import { ORDER_STATUS } from "@/types";

export function useOrderColumns(): GridColDef<Order>[] {
  return useMemo<GridColDef<Order>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
        valueFormatter: (value, row) =>
          row.id === NEW_ROW_ID ? "—" : String(value),
      },
      {
        field: "product_name",
        headerName: "Product",
        flex: 1,
        minWidth: 150,
        editable: true,
      },
      {
        field: "customer_name",
        headerName: "Customer",
        flex: 1,
        minWidth: 160,
        editable: true,
      },
      {
        field: "delivery_address",
        headerName: "Delivery address",
        flex: 1,
        minWidth: 180,
        editable: true,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        type: "number",
        width: 80,
        editable: true,
      },
      {
        field: "price_per_item",
        headerName: "Price / item",
        type: "number",
        width: 130,
        editable: true,
        valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        type: "singleSelect",
        valueOptions: [...ORDER_STATUS],
        editable: true,
        renderCell: (params) => <OrderStatus status={params.value as OrderStatusType} />,
      },
      {
        field: "created_at",
        headerName: "Created at",
        flex: 1,
        minWidth: 180,
        valueFormatter: (value: string) =>
          value ? new Date(value).toLocaleString() : "",
      },
    ],
    []
  );
}
