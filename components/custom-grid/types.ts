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
  /** When provided, enables inline "add row" and the Add button. */
  getNewRow?: () => T;
}

export interface CustomGridProps<T extends GridValidRowModel> {
  loadData: CustomGridLoadData<T>;
  crud: CustomGridCrud<T>;
  /** Data columns only; the actions column (View / Edit / Delete / Save / Cancel) is added by the grid. */
  columns: GridColDef<T>[];
  /** Id used for the inline "new" row when using getNewRow. Use the same value in your column defs (e.g. ID "—"). Default -1. */
  newRowId?: GridRowId;
}
