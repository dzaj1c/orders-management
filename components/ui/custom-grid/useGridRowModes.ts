"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import type { GridRowModesModel, GridRowId } from "@mui/x-data-grid";
import { GridRowModes } from "@mui/x-data-grid";

export interface GridRowModesEditHandlers {
  rowModesModel: GridRowModesModel;
  onStartEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId) => void;
  onCancel: (id: GridRowId) => void;
  newRowId: GridRowId;
}

export interface UseGridRowModesOptions<T> {
  data: T[];
  newRowId: GridRowId;
  getNewRow: () => T;
}

export function useGridRowModes<T>(options: UseGridRowModesOptions<T>) {
  const { data, newRowId, getNewRow } = options;
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
      delete next[newRowId];
      return next;
    });
  }, [newRowId]);

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

  const handleCancel = useCallback(
    (id: GridRowId) => {
      if (id === newRowId) {
        clearNewRow();
        return;
      }
      stopRequestedForRowIdRef.current = id;
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    },
    [newRowId, clearNewRow]
  );

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

  const handleAddRow = useCallback(() => {
    setIsAddingRow(true);
    setRowModesModel((prev) => ({
      ...prev,
      [newRowId]: { mode: GridRowModes.Edit },
    }));
  }, [newRowId]);

  const editHandlers: GridRowModesEditHandlers = useMemo(
    () => ({
      rowModesModel,
      onStartEdit: handleStartEdit,
      onSave: handleSave,
      onCancel: handleCancel,
      newRowId,
    }),
    [rowModesModel, handleStartEdit, handleSave, handleCancel, newRowId]
  );

  const gridRows = useMemo(() => {
    if (!isAddingRow) return data;
    const newRow = getNewRow();
    return [newRow, ...data];
  }, [isAddingRow, data, getNewRow]);

  return {
    rowModesModel,
    onRowModesModelChange,
    handleStartEdit,
    handleSave,
    handleCancel,
    handleAddRow,
    isAddingRow,
    clearNewRow,
    editHandlers,
    gridRows,
    newRowId,
  };
}
