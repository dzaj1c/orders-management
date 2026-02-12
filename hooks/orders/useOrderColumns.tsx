import * as React from "react";
import { type GridColDef, GridRowModes, type GridRowModesModel, type GridRowId } from "@mui/x-data-grid";
import { OrderStatus } from "@/components";
import { OrderRowActions } from "@/components/orders/OrderRowActions";
import type { Order, OrderStatus as OrderStatusType } from "@/types";
import { ORDER_STATUS } from "@/types";

export interface OrderColumnsEditHandlers {
  rowModesModel: GridRowModesModel;
  onStartEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId) => void;
  onCancel: (id: GridRowId) => void;
  /** When set, this row id is the inline "new" row; ID column shows "—" instead of the value. */
  newRowId?: GridRowId;
}

export function useOrderColumns(
  onDeleteOrder: (id: number) => void | Promise<void>,
  editHandlers: OrderColumnsEditHandlers,
  onView?: (id: number) => void
) {
  const { rowModesModel, onStartEdit, onSave, onCancel, newRowId } = editHandlers;

  return React.useMemo<GridColDef<Order>[]>(() => [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      valueFormatter: (value, row) =>
        newRowId != null && row.id === newRowId ? "—" : String(value),
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
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 260,
      renderCell: (params) => (
        <OrderRowActions
          params={params}
          isEditMode={rowModesModel[params.id]?.mode === GridRowModes.Edit}
          onView={onView}
          onDelete={onDeleteOrder}
          onStartEdit={onStartEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      ),
    },
  ], [onDeleteOrder, onView, rowModesModel, onStartEdit, onSave, onCancel, newRowId]);
}
