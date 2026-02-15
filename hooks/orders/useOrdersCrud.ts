"use client";

/**
 * Wires create/update/delete to server actions. Grid owns refetch (loadPage) and clearNewRow.
 */
import { useCallback } from "react";
import {
  createOrder as createOrderAction,
  updateOrder as updateOrderAction,
  deleteOrder as deleteOrderAction,
} from "@/app/actions/orders";
import { useSnackbar } from "@/components/ui/AppSnackbar";
import { NEW_ROW_ID } from "@/components/orders/useOrderRowModes";
import type { Order, OrderInsert, OrderUpdate } from "@/types";

export interface UseOrdersCrudList {
  setError: (value: string | null) => void;
}

export interface OrdersCrudCallbacks {
  onCreate: (data: OrderInsert) => Promise<Order>;
  onUpdate: (id: number, data: OrderUpdate) => Promise<Order>;
  onDelete: (id: number) => Promise<void>;
  onError?: (error: unknown) => void;
}

export function useOrdersCrud(list: UseOrdersCrudList): OrdersCrudCallbacks {
  const { showError } = useSnackbar();

  const onCreate = useCallback(
    async (data: OrderInsert): Promise<Order> => {
      const result = await createOrderAction(data);
      if (!result.success) {
        showError(result.error);
        throw new Error(result.error);
      }
      list.setError(null);
      return result.data;
    },
    [list, showError]
  );

  const onUpdate = useCallback(
    async (id: number, data: OrderUpdate): Promise<Order> => {
      const result = await updateOrderAction(id, data);
      if (!result.success) {
        showError(result.error);
        throw new Error(result.error);
      }
      list.setError(null);
      return result.data;
    },
    [list, showError]
  );

  const onDelete = useCallback(
    async (id: number): Promise<void> => {
      if (id === NEW_ROW_ID) return;
      const result = await deleteOrderAction(Number(id));
      if (!result.success) {
        showError(result.error);
        throw new Error(result.error);
      }
      list.setError(null);
    },
    [list, showError]
  );

  const onError = useCallback(
    (err: unknown) => {
      showError(err instanceof Error ? err.message : String(err));
    },
    [showError]
  );

  return { onCreate, onUpdate, onDelete, onError };
}
