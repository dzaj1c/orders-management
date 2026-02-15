"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridValidRowModel } from "@mui/x-data-grid";
import { dataGridWrapper } from "@/styles/page-layout";
import {
  dataGridDefaultProps,
  dataGridSlotProps,
  getRowClassName,
  PAGE_SIZE_OPTIONS,
} from "./constants";
import type { CustomGridProps } from "./types";
import { useCustomGrid } from "./useCustomGrid";

export type { CustomGridCrud, CustomGridLoadData, CustomGridProps } from "./types";

export function CustomGrid<T extends GridValidRowModel>(props: CustomGridProps<T>) {
  const {
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
  } = useCustomGrid(props);

  const { crud } = props;

  return (
    <>
      {hasRowModes && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={rowModes.handleAddRow}
            disabled={rowModes.isAddingRow}
            startIcon={<AddIcon />}
          >
            Add inline
          </Button>
        </Box>
      )}
      <Box sx={dataGridWrapper}>
        <DataGrid<T>
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          getRowId={getRowId}
          editMode={editMode}
          rowModesModel={hasRowModes ? rowModes.rowModesModel : undefined}
          onRowModesModelChange={hasRowModes ? rowModes.onRowModesModelChange : undefined}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={crud.onError}
          getRowClassName={getRowClassName}
          slotProps={dataGridSlotProps}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          {...dataGridDefaultProps}
        />
      </Box>
    </>
  );
}
