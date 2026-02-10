"use client";

import * as React from "react";
import {
  listOrdersPaginated,
  createOrder as createOrderAction,
  updateOrder as updateOrderAction,
  deleteOrder as deleteOrderAction,
} from "@/app/actions/orders";
import { handleResult } from "@/lib/actionResult";
import { useSnackbar } from "@/components/ui/AppSnackbar";
import { useOrderColumns } from "@/components/orders/useOrderColumns";
import type { Order } from "@/types";
import { ORDER_STATUS } from "@/types";
import type { GridPaginationModel, GridRowModesModel, GridRowId } from "@mui/x-data-grid";
import { GridRowModes } from "@mui/x-data-grid";

const INITIAL_PAGINATION: GridPaginationModel = { page: 0, pageSize: 10 };

/** Temporary id for the inline "new order" row. Must not conflict with real order ids. */
export const NEW_ROW_ID = -1;

const newOrderPlaceholder: Order = {
  id: NEW_ROW_ID,
  product_name: "",
  customer_name: "",
  delivery_address: "",
  quantity: 0,
  price_per_item: 0,
  status: ORDER_STATUS[0],
  created_at: "",
  updated_at: "",
};

export function useOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>(INITIAL_PAGINATION);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [isAddingRow, setIsAddingRow] = React.useState(false);
  const rowModesModelRef = React.useRef<GridRowModesModel>({});
  const stopRequestedForRowIdRef = React.useRef<GridRowId | null>(null);
  const { showError } = useSnackbar();

  React.useEffect(() => {
    rowModesModelRef.current = rowModesModel;
  }, [rowModesModel]);

  const loadPage = React.useCallback(
    async (overrides?: { page?: number; pageSize?: number }) => {
      setLoading(true);
      const page = overrides?.page ?? paginationModel.page;
      const pageSize = overrides?.pageSize ?? paginationModel.pageSize;
      const result = await listOrdersPaginated(page, pageSize);
      if (handleResult(result, setError)) {
        setOrders(result.data.orders);
        setTotal(result.data.total);
      }
      if (overrides?.page !== undefined) {
        setPaginationModel((prev) => ({ ...prev, page: overrides.page! }));
      }
      setLoading(false);
    },
    [paginationModel.page, paginationModel.pageSize]
  );

  React.useEffect(() => {
    loadPage();
  }, [loadPage]);

  const onProcessRowUpdate = React.useCallback(
    async (newRow: Order): Promise<Order> => {
      const isNewOrder = Number(newRow.id) === NEW_ROW_ID;

      if (isNewOrder) {
        const result = await createOrderAction({
          product_name: newRow.product_name,
          customer_name: newRow.customer_name,
          delivery_address: newRow.delivery_address,
          quantity: Number(newRow.quantity),
          price_per_item: Number(newRow.price_per_item),
          status: newRow.status,
        });
        if (!result.success) {
          showError(result.error);
          throw new Error(result.error);
        }
        setError(null);
        setIsAddingRow(false);
        setRowModesModel((prev) => {
          const next = { ...prev };
          delete next[NEW_ROW_ID];
          return next;
        });
        await loadPage({ page: 0 });
        return result.data;
      }

      const orderId = Number(newRow.id);
      const result = await updateOrderAction(orderId, {
        product_name: newRow.product_name,
        customer_name: newRow.customer_name,
        delivery_address: newRow.delivery_address,
        quantity: Number(newRow.quantity),
        price_per_item: Number(newRow.price_per_item),
        status: newRow.status,
      });
      if (!result.success) {
        showError(result.error);
        throw new Error(result.error);
      }
      setError(null);
      await loadPage();
      return result.data;
    },
    [loadPage, showError]
  );

  const onProcessRowUpdateError = React.useCallback(
    (err: unknown) => {
      showError(err instanceof Error ? err.message : String(err));
    },
    [showError]
  );

  const onDeleteOrder = React.useCallback(
    async (id: number) => {
      if (id === NEW_ROW_ID) return;
      const result = await deleteOrderAction(Number(id));
      if (result.success) {
        setError(null);
        await loadPage();
      } else {
        showError(result.error);
      }
    },
    [loadPage, showError]
  );

  const handleStartEdit = React.useCallback((id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const handleSave = React.useCallback((id: GridRowId) => {
    stopRequestedForRowIdRef.current = id;
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  }, []);

  const handleCancel = React.useCallback((id: GridRowId) => {
    if (Number(id) === NEW_ROW_ID) {
      setIsAddingRow(false);
      setRowModesModel((prev) => {
        const next = { ...prev };
        delete next[NEW_ROW_ID];
        return next;
      });
      return;
    }
    stopRequestedForRowIdRef.current = id;
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  }, []);

  const onRowModesModelChange = React.useCallback(
    (newModel: GridRowModesModel) => {
      const requested = stopRequestedForRowIdRef.current;
      stopRequestedForRowIdRef.current = null;
      const scheduleUpdate = (updater: React.SetStateAction<GridRowModesModel>) => {
        queueMicrotask(() => setRowModesModel(updater));
      };
      if (requested != null) {
        scheduleUpdate(newModel);
        return;
      }
      const prev = rowModesModelRef.current;
      for (const id of Object.keys(newModel)) {
        if (
          newModel[id]?.mode === GridRowModes.View &&
          prev[id]?.mode === GridRowModes.Edit
        ) {
          scheduleUpdate((prevState) => ({
            ...prevState,
            [id]: { mode: GridRowModes.Edit },
          }));
          return;
        }
      }
      scheduleUpdate(newModel);
    },
    []
  );

  const editHandlers = React.useMemo(
    () => ({
      rowModesModel,
      onStartEdit: handleStartEdit,
      onSave: handleSave,
      onCancel: handleCancel,
      newRowId: NEW_ROW_ID,
    }),
    [rowModesModel, handleStartEdit, handleSave, handleCancel]
  );

  const columns = useOrderColumns(onDeleteOrder, editHandlers);

  const handleAddOrder = React.useCallback(() => {
    setIsAddingRow(true);
    setRowModesModel((prev) => ({
      ...prev,
      [NEW_ROW_ID]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const gridRows = React.useMemo(() => {
    if (!isAddingRow) return orders;
    const now = new Date().toISOString();
    const newRow = {
      ...newOrderPlaceholder,
      created_at: now,
      updated_at: now,
    };
    return [newRow, ...orders];
  }, [isAddingRow, orders]);

  const gridProps = React.useMemo(
    () => ({
      orders: gridRows,
      total: isAddingRow ? total + 1 : total,
      loading,
      columns,
      paginationModel,
      onPaginationModelChange: setPaginationModel,
      rowModesModel,
      onRowModesModelChange,
      onProcessRowUpdate,
      onProcessRowUpdateError,
    }),
    [
      gridRows,
      total,
      isAddingRow,
      loading,
      columns,
      paginationModel,
      rowModesModel,
      onRowModesModelChange,
      onProcessRowUpdate,
      onProcessRowUpdateError,
    ]
  );

  return { error, gridProps, handleAddOrder, isAddingRow };
}
