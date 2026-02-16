"use client";

import { useCallback, useState } from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { GridRenderCellParams, GridRowId, GridValidRowModel } from "@mui/x-data-grid";

export interface GridRowActionsProps<T extends GridValidRowModel = GridValidRowModel> {
  params: GridRenderCellParams<T>;
  isEditMode: boolean;
  onView?: (id: GridRowId) => void;
  onDelete: (id: GridRowId) => void | Promise<void>;
  onStartEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId) => void;
  onCancel: (id: GridRowId) => void;
}

export function GridRowActions<T extends GridValidRowModel = GridValidRowModel>({
  params,
  isEditMode,
  onView,
  onDelete,
  onStartEdit,
  onSave,
  onCancel,
}: GridRowActionsProps<T>) {
  const id = params.id as GridRowId;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = useCallback(() => onSave(id), [id, onSave]);
  const handleCancel = useCallback(() => onCancel(id), [id, onCancel]);
  const handleEdit = useCallback(() => onStartEdit(id), [id, onStartEdit]);
  const handleView = useCallback(() => onView?.(id), [id, onView]);
  const handleDeleteClick = useCallback(() => setDeleteDialogOpen(true), []);
  const handleDeleteClose = useCallback(() => setDeleteDialogOpen(false), []);
  const handleDeleteConfirm = useCallback(() => {
    void Promise.resolve(onDelete(id));
  }, [id, onDelete]);

  if (isEditMode) {
    return (
      <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Save">
          <Button size="small" variant="contained" color="primary" onClick={handleSave} startIcon={<SaveIcon />}>
            Save
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button size="small" variant="outlined" onClick={handleCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
      {onView != null && (
        <Tooltip title="View">
          <Button size="small" variant="outlined" onClick={handleView} startIcon={<VisibilityIcon />}>
            View
          </Button>
        </Tooltip>
      )}
      <Tooltip title="Edit">
        <Button size="small" variant="outlined" onClick={handleEdit} startIcon={<EditIcon />}>
          Edit
        </Button>
      </Tooltip>
      <Tooltip title="Delete">
        <Button size="small" variant="outlined" color="error" onClick={handleDeleteClick} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Tooltip>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete row?"
        description="This action cannot be undone. Are you sure you want to delete this row?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="error"
      />
      </Stack>
    );
}
