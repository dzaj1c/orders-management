"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import type { Order } from "@/types";
import { ORDER_STATUS } from "@/types";
import type { GridRowModesModel, GridRowId } from "@mui/x-data-grid";
import { GridRowModes } from "@mui/x-data-grid";

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

export interface OrderRowModesEditHandlers {
  rowModesModel: GridRowModesModel;
  onStartEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId) => void;
  onCancel: (id: GridRowId) => void;
  newRowId: GridRowId;
}

export function useOrderRowModes(orders: Order[]) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const rowModesModelRef = useRef<GridRowModesModel>({});
  const stopRequestedForRowIdRef = useRef<GridRowId | null>(null);

  useEffect(() => {
    rowModesModelRef.current = rowModesModel;
  }, [rowModesModel]);

  const clearNewRow = useCallback(() => {
    setIsAddingRow(false);
    setRowModesModel((prev) => {
      const next = { ...prev };
      delete next[NEW_ROW_ID];
      return next;
    });
  }, []);

  const handleStartEdit = useCallback((id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const handleSave = useCallback((id: GridRowId) => {
    stopRequestedForRowIdRef.current = id;
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  }, []);

  const handleCancel = useCallback((id: GridRowId) => {
    if (Number(id) === NEW_ROW_ID) {
      clearNewRow();
      return;
    }
    stopRequestedForRowIdRef.current = id;
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  }, [clearNewRow]);

  const onRowModesModelChange = useCallback(
    (newModel: GridRowModesModel) => {
      const requested = stopRequestedForRowIdRef.current;
      stopRequestedForRowIdRef.current = null;
      const scheduleUpdate = (updater: SetStateAction<GridRowModesModel>) => {
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

  const handleAddOrder = useCallback(() => {
    setIsAddingRow(true);
    setRowModesModel((prev) => ({
      ...prev,
      [NEW_ROW_ID]: { mode: GridRowModes.Edit },
    }));
  }, []);

  const editHandlers: OrderRowModesEditHandlers = useMemo(
    () => ({
      rowModesModel,
      onStartEdit: handleStartEdit,
      onSave: handleSave,
      onCancel: handleCancel,
      newRowId: NEW_ROW_ID,
    }),
    [rowModesModel, handleStartEdit, handleSave, handleCancel]
  );

  const gridRows = useMemo(() => {
    if (!isAddingRow) return orders;
    const now = new Date().toISOString();
    const newRow = {
      ...newOrderPlaceholder,
      created_at: now,
      updated_at: now,
    };
    return [newRow, ...orders];
  }, [isAddingRow, orders]);

  return {
    rowModesModel,
    onRowModesModelChange,
    handleStartEdit,
    handleSave,
    handleCancel,
    handleAddOrder,
    isAddingRow,
    clearNewRow,
    editHandlers,
    gridRows,
    newRowId: NEW_ROW_ID,
  };
}
