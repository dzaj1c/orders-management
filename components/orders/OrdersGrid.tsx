"use client";

import { Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { dataGridWrapper } from "@/styles/page-layout";
import type { Order } from "@/types";

interface OrdersGridProps {
  orders: Order[];
  total: number;
  loading: boolean;
  columns: GridColDef<Order>[];
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  rowModesModel: GridRowModesModel;
  onRowModesModelChange: (model: GridRowModesModel) => void;
  onProcessRowUpdate: (
    newRow: Order,
    oldRow: Order
  ) => Promise<Order>;
  onProcessRowUpdateError?: (error: unknown) => void;
}

export function OrdersGrid({
  orders,
  total,
  loading,
  columns,
  paginationModel,
  onPaginationModelChange,
  rowModesModel,
  onRowModesModelChange,
  onProcessRowUpdate,
  onProcessRowUpdateError,
}: OrdersGridProps) {
  return (
    <Box sx={dataGridWrapper}>
      <DataGrid
        rows={orders}
        columns={columns}
        rowCount={total}
        loading={loading}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={onRowModesModelChange}
        processRowUpdate={onProcessRowUpdate}
        onProcessRowUpdateError={onProcessRowUpdateError}
        density="standard"
        disableColumnResize
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: { variant: "outlined", size: "small" },
              columnInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
              operatorInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
              valueInputProps: {
                InputComponentProps: { variant: "outlined", size: "small" },
              },
            },
          },
        }}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}