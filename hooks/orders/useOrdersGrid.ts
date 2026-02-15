"use client";

import { useMemo } from "react";
import type { CustomGridCrud } from "@/components/custom-grid";
import { useOrderColumns } from "@/hooks/orders/useOrderColumns";
import type { Order, OrderInsert, OrderUpdate } from "@/types";
import type { GridRowId } from "@mui/x-data-grid";

const NEW_ORDER_ROW_ID = -1 satisfies number;

const noop = () => {};
const emptyRowModes = {
  rowModesModel: {} as import("@mui/x-data-grid").GridRowModesModel,
  onStartEdit: noop,
  onSave: noop,
  onCancel: noop,
  newRowId: NEW_ORDER_ROW_ID as GridRowId,
};

function rowToInsert(row: Order): OrderInsert {
  return {
    product_name: row.product_name,
    customer_name: row.customer_name,
    delivery_address: row.delivery_address,
    quantity: Number(row.quantity),
    price_per_item: Number(row.price_per_item),
    status: row.status,
  };
}

function rowToUpdate(row: Order): OrderUpdate {
  return {
    product_name: row.product_name,
    customer_name: row.customer_name,
    delivery_address: row.delivery_address,
    quantity: Number(row.quantity),
    price_per_item: Number(row.price_per_item),
    status: row.status,
  };
}

export interface OrdersGridLoadData {
  (page: number, pageSize: number): Promise<{ data: Order[]; total: number }>;
}

export interface OrdersGridCrud {
  onCreate: (data: OrderInsert) => Promise<Order>;
  onUpdate: (id: number, data: OrderUpdate) => Promise<Order>;
  onView?: (id: number) => void;
  onDelete: (id: number) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export interface UseOrdersGridOptions {
  loadData: OrdersGridLoadData;
  crud: OrdersGridCrud;
}

/** Returns props for CustomGrid<Order> so the orders page can render the grid without OrdersGrid. */
export function useOrdersGrid({ loadData, crud }: UseOrdersGridOptions) {
  const gridCrud = useMemo(
    (): CustomGridCrud<Order> => ({
      getNewRow: () => ({
        id: NEW_ORDER_ROW_ID as number,
        product_name: "",
        customer_name: "",
        delivery_address: "",
        quantity: 0,
        price_per_item: 0,
        status: "CREATED",
        created_at: "",
        updated_at: "",
      }),
      onCreate: async (row: Order) => crud.onCreate(rowToInsert(row)),
      onUpdate: async (id: GridRowId, row: Order) => crud.onUpdate(Number(id), rowToUpdate(row)),
      onDelete: async (id: GridRowId) => crud.onDelete(Number(id)),
      onView: crud.onView != null ? (id: GridRowId) => crud.onView!(Number(id)) : undefined,
      onError: crud.onError,
    }),
    [crud]
  );

  const columns = useOrderColumns(
    noop,
    emptyRowModes,
    undefined,
    { includeActions: false, newRowId: NEW_ORDER_ROW_ID as GridRowId }
  );

  return {
    loadData,
    crud: gridCrud,
    columns,
    newRowId: NEW_ORDER_ROW_ID as GridRowId,
  };
}
