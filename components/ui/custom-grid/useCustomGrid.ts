"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridColDef, GridPaginationModel, GridRowId, GridValidRowModel } from "@mui/x-data-grid";
import { getActionsColumn } from "./actionsColumn";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, NEW_ROW_ID } from "./constants";
import type { CustomGridCrud, CustomGridLoadData, CustomGridProps } from "./types";
import { useGridRowModes } from "./useGridRowModes";

export function useCustomGrid<T extends GridValidRowModel>(props: CustomGridProps<T>) {
  const { loadData, crud, columns: dataColumns } = props;
  const newRowId = NEW_ROW_ID;

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadData(page, pageSize)
      .then(({ data: nextData, total: nextTotal }) => {
        if (!cancelled) {
          setData(nextData);
          setTotal(nextTotal);
        }
      })
      .catch((err) => {
        if (!cancelled && crud.onError) crud.onError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadData, page, pageSize, crud.onError]);

  const hasRowModes = crud.getNewRow != null;
  const rowModes = useGridRowModes({
    data,
    newRowId,
    getNewRow: crud.getNewRow ?? (() => ({} as T)),
  });

  const rows = hasRowModes ? rowModes.gridRows : data;
  const rowCount = hasRowModes && rowModes.isAddingRow ? total + 1 : total;

  const handleDelete = useCallback(
    async (id: GridRowId) => {
      if (crud.onDelete) {
        await crud.onDelete(id);
        const { data: nextData, total: nextTotal } = await loadData(page, pageSize);
        setData(nextData);
        setTotal(nextTotal);
      }
    },
    [crud.onDelete, loadData, page, pageSize]
  );

  const handleProcessRowUpdate = useCallback(
    async (newRow: T, oldRow: T): Promise<T> => {
      const id = (oldRow as { id?: GridRowId })?.id;
      const isNew = id === newRowId;
      let result: T;
      if (isNew && crud.onCreate) {
        result = await crud.onCreate(newRow);
        rowModes.clearNewRow();
        const { data: nextData, total: nextTotal } = await loadData(0, pageSize);
        setData(nextData);
        setTotal(nextTotal);
      } else if (!isNew && crud.onUpdate) {
        result = await crud.onUpdate(id!, newRow);
        const { data: nextData, total: nextTotal } = await loadData(page, pageSize);
        setData(nextData);
        setTotal(nextTotal);
      } else {
        result = newRow;
      }
      return result;
    },
    [crud.onCreate, crud.onUpdate, loadData, page, pageSize, rowModes.clearNewRow]
  );

  const getRowId = useCallback((row: T) => (row as unknown as { id: GridRowId }).id, []);

  const columns = useMemo<GridColDef<T>[]>(
    () => [
      ...dataColumns,
      getActionsColumn<T>(rowModes.editHandlers, handleDelete, crud.onView),
    ],
    [dataColumns, rowModes.editHandlers, handleDelete, crud.onView]
  );

  const editMode =
    crud.onCreate != null || crud.onUpdate != null ? ("row" as const) : undefined;
  const processRowUpdate =
    crud.onCreate != null || crud.onUpdate != null ? handleProcessRowUpdate : undefined;

  return {
    paginationModel,
    setPaginationModel,
    columns,
    rows,
    rowCount,
    loading,
    getRowId,
    hasRowModes,
    rowModes,
    editMode,
    processRowUpdate,
  };
}
