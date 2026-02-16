"use client";

import type { GridColDef, GridRowId, GridValidRowModel } from "@mui/x-data-grid";
import { GridRowModes } from "@mui/x-data-grid";
import type { GridRowModesEditHandlers } from "./useGridRowModes";
import { GridRowActions } from "./GridRowActions";

const ACTIONS_COLUMN_WIDTH = 260;

export function getActionsColumn<T extends GridValidRowModel>(
  editHandlers: GridRowModesEditHandlers,
  onDelete: (id: GridRowId) => void | Promise<void>,
  onView?: (id: GridRowId) => void
): GridColDef<T> {
  const { rowModesModel, onStartEdit, onSave, onCancel } = editHandlers;
  return {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    width: ACTIONS_COLUMN_WIDTH,
    renderCell: (params) => (
      <GridRowActions<T>
        params={params}
        isEditMode={rowModesModel[params.id]?.mode === GridRowModes.Edit}
        onView={onView}
        onDelete={onDelete}
        onStartEdit={onStartEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    ),
  };
}
