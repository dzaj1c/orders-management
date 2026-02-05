"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Order } from "@/types";
import { listOrdersPaginated } from "@/app/actions/orders";
import { handleResult } from "@/lib/actionResult";
import { OrderStatus } from "@/components";
import {
  pageLayout,
  pageContentList,
  loadingContainerShort,
  dataGridWrapper,
} from "@/styles/page-layout";

const INITIAL_PAGINATION = { page: 0, pageSize: 10 };

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [paginationModel, setPaginationModel] = React.useState(INITIAL_PAGINATION);
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      const result = await listOrdersPaginated(
        paginationModel.page,
        paginationModel.pageSize
      );
      if (!isMounted) return;
      if (!handleResult(result, setError)) {
        setLoading(false);
        return;
      }
      setOrders(result.data.orders);
      setTotal(result.data.total);
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [paginationModel.page, paginationModel.pageSize]);

  const columns = React.useMemo<GridColDef<Order>[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "product_name", headerName: "Product", flex: 1, minWidth: 150 },
      { field: "customer_name", headerName: "Customer", flex: 1, minWidth: 160 },
      {
        field: "quantity",
        headerName: "Quantity",
        type: "number",
        width: 80,
      },
      {
        field: "price_per_item",
        headerName: "Price / item",
        type: "number",
        width: 130,
        valueFormatter: (value: number): string =>
          typeof value === "number" ? `$${value.toFixed(2)}` : String(value),
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <OrderStatus status={params.value as Order["status"]} />
        ),
      },
      {
        field: "created_at",
        headerName: "Created at",
        flex: 1,
        minWidth: 180,
        valueFormatter: (value: string): string =>
          value ? new Date(value).toLocaleString() : "",
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        width: 140,
        renderCell: (params) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => router.push(`/orders/${params.row.id}`)}
          >
            View
          </Button>
        ),
      },
    ],
    [router]
  );

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentList}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage customer orders and view their current status.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/orders/create"
            variant="contained"
            color="primary"
          >
            Create order
          </Button>
        </Stack>

        {loading ? (
          <Box sx={loadingContainerShort}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={dataGridWrapper}>
            <DataGrid
              rows={orders}
              columns={columns}
              rowCount={total}
              loading={loading}
              disableRowSelectionOnClick
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
