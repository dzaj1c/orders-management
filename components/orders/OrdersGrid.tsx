"use client";

import { Box } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { dataGridWrapper } from "@/styles/page-layout";
import { useOrderColumns } from "./useOrderColumns";
import type { Order } from "@/types";

interface OrdersTableProps {
  orders: Order[];
  total: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export function OrdersGrid({
  orders,
  total,
  loading,
  paginationModel,
  onPaginationModelChange,
}: OrdersTableProps) {
  const columns = useOrderColumns();

  return (
    <Box sx={dataGridWrapper}>
      <DataGrid
        rows={orders}
        columns={columns}
        rowCount={total}
        loading={loading}
        density="compact"
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