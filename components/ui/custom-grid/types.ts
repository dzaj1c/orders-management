import type { GridColDef, GridRowId, GridValidRowModel } from "@mui/x-data-grid";

export interface CustomGridLoadData<T> {
  (page: number, pageSize: number): Promise<{ data: T[]; total: number }>;
}

export interface CustomGridCrud<T extends GridValidRowModel> {
  onCreate?: (row: T) => Promise<T>;
  onUpdate?: (id: GridRowId, row: T) => Promise<T>;
  onDelete?: (id: GridRowId) => void | Promise<void>;
  onView?: (id: GridRowId) => void;
  onError?: (error: unknown) => void;
  getNewRow?: () => T;
}

export interface CustomGridProps<T extends GridValidRowModel> {
  loadData: CustomGridLoadData<T>;
  crud: CustomGridCrud<T>;
  columns: GridColDef<T>[];
}
