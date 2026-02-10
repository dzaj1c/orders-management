"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import type { GridRowId } from "@mui/x-data-grid";
import type { Order } from "@/types";

interface OrderRowActionsProps {
  params: GridRenderCellParams<Order>;
  isEditMode: boolean;
  onDelete: (id: number) => void | Promise<void>;
  onStartEdit: (id: GridRowId) => void;
  onSave: (id: GridRowId) => void;
  onCancel: (id: GridRowId) => void;
}

export function OrderRowActions({
  params,
  isEditMode,
  onDelete,
  onStartEdit,
  onSave,
  onCancel,
}: OrderRowActionsProps) {
  const router = useRouter();
  const id = params.id as number;

  const handleSave = React.useCallback(() => {
    onSave(id);
  }, [id, onSave]);

  const handleCancel = React.useCallback(() => {
    onCancel(id);
  }, [id, onCancel]);

  const handleEdit = React.useCallback(() => {
    onStartEdit(id);
  }, [id, onStartEdit]);

  const handleView = React.useCallback(() => {
    router.push(`/orders/${id}`);
  }, [router, id]);

  const handleDelete = React.useCallback(() => {
    if (window.confirm("Delete this order?")) {
      void Promise.resolve(onDelete(id));
    }
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
      <Tooltip title="View">
        <Button size="small" variant="outlined" onClick={handleView} startIcon={<VisibilityIcon />}>
          View
        </Button>
      </Tooltip>
      <Tooltip title="Edit">
        <Button size="small" variant="outlined" onClick={handleEdit} startIcon={<EditIcon />}>
          Edit
        </Button>
      </Tooltip>
      <Tooltip title="Delete">
        <Button size="small" variant="outlined" color="error" onClick={handleDelete} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Tooltip>
    </Stack>
  );
}
