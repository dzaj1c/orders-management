"use client";

import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { dataGridWrapper } from "@/styles/page-layout";
import { useOrderColumns, useOrderRowModes, NEW_ROW_ID } from "@/hooks/orders";
import type { Order, OrderInsert, OrderUpdate } from "@/types";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

function rowToInsert(row: Order): OrderInsert {
  return {
    product_name: row.product_name,
    customer_name: row.customer_name,
    delivery_address: row.delivery_address,
    quantity: Number(row.quantity),
    price_per_item: Number(row.price_per_item),
    status: row.status,
  };
}

function rowToUpdate(row: Order): OrderUpdate {
  return {
    product_name: row.product_name,
    customer_name: row.customer_name,
    delivery_address: row.delivery_address,
    quantity: Number(row.quantity),
    price_per_item: Number(row.price_per_item),
    status: row.status,
  };
}

export interface OrdersGridLoadPage {
  (page: number, pageSize: number): Promise<{ data: Order[]; total: number }>;
}

export interface OrdersGridCrud {
  onCreate: (data: OrderInsert) => Promise<Order>;
  onUpdate: (id: number, data: OrderUpdate) => Promise<Order>;
  onView?: (id: number) => void;
  onDelete: (id: number) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

interface OrdersGridProps {
  loadPage: OrdersGridLoadPage;
  crud: OrdersGridCrud;
}

export function OrdersGrid({ loadPage, crud }: OrdersGridProps) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { page, pageSize } = paginationModel;

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPage(page, pageSize)
      .then(({ data, total: t }) => {
        if (!cancelled) {
          setOrders(data);
          setTotal(t);
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
  }, [loadPage, page, pageSize, crud.onError]);

  const rowModes = useOrderRowModes(orders);

  const handleDelete = React.useCallback(
    async (id: number) => {
      await crud.onDelete(id);
      const { data, total: t } = await loadPage(page, pageSize);
      setOrders(data);
      setTotal(t);
    },
    [crud.onDelete, loadPage, page, pageSize]
  );

  const columns = useOrderColumns(handleDelete, rowModes.editHandlers, crud.onView);

  const handleProcessRowUpdate = React.useCallback(
    async (newRow: Order): Promise<Order> => {
      const isNew = Number(newRow.id) === NEW_ROW_ID;
      if (isNew) {
        const created = await crud.onCreate(rowToInsert(newRow));
        rowModes.clearNewRow();
        const { data, total: t } = await loadPage(0, pageSize);
        setOrders(data);
        setTotal(t);
        return created;
      }
      const updated = await crud.onUpdate(Number(newRow.id), rowToUpdate(newRow));
      const { data, total: t } = await loadPage(page, pageSize);
      setOrders(data);
      setTotal(t);
      return updated;
    },
    [crud, loadPage, page, pageSize, rowModes.clearNewRow]
  );

  return (
    <Stack direction="column" gap={1}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={rowModes.handleAddOrder}
          disabled={rowModes.isAddingRow}
          startIcon={<AddIcon />}
        >
          Add inline
        </Button>
      </Box>
      <Box sx={dataGridWrapper}>
        <DataGrid
          rows={rowModes.gridRows}
          columns={columns}
          rowCount={rowModes.isAddingRow ? total + 1 : total}
          loading={loading}
          editMode="row"
          rowModesModel={rowModes.rowModesModel}
          onRowModesModelChange={rowModes.onRowModesModelChange}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={crud.onError}
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
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>
    </Stack>
  );
}
