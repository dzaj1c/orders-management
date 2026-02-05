"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { Order } from "@/types";
import type { OrderStatus } from "@/types";
import { getOrderById, deleteOrder, updateOrder } from "@/app/actions/orders";
import { OrderStatus as OrderStatusBadge } from "@/components";
import {
  pageLayout,
  pageContentDetail,
  loadingContainer,
  errorContainer,
  formCard,
} from "@/styles/page-layout";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [statusUpdating, setStatusUpdating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const id = params.id;
    if (!id) {
      notFound();
      return;
    }

    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
      setError("Invalid order.");
      setLoading(false);
      return;
    }

    async function load() {
      const result = await getOrderById(idNum);
      if (!isMounted) return;
      if (!result.success) {
        setError(result.error);
      } else {
        setOrder(result.data);
      }
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const handleStatusChange = React.useCallback(
    async (newStatus: OrderStatus) => {
      if (!order || newStatus === order.status) return;
      setStatusUpdating(true);
      const result = await updateOrder(order.id, { status: newStatus });
      setStatusUpdating(false);
      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error);
      }
    },
    [order]
  );

  if (loading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={errorContainer}>
        <Typography color="error">{error ?? "Order not found."}</Typography>
        <Button variant="outlined" onClick={() => router.push("/orders")}>
          Back to orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentDetail}>
        <Stack direction="row" justifyContent="space-between" mb={3} gap={2}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Order #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created{" "}
              {new Date(order.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <OrderStatusBadge
              status={order.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
            />
            <Button
              variant="outlined"
              onClick={() => router.push(`/orders/${order.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <Button variant="outlined" onClick={() => router.push("/orders")}>
              Back to list
            </Button>
          </Stack>
        </Stack>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
          aria-labelledby="delete-order-title"
          aria-describedby="delete-order-description"
        >
          <DialogTitle id="delete-order-title">
            Delete order #{order.id}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-order-description">
              This will permanently delete this order. This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setDeleting(true);
                const result = await deleteOrder(order.id);
                setDeleting(false);
                if (result.success) {
                  router.push("/orders");
                } else {
                  setError(result.error);
                  setDeleteDialogOpen(false);
                }
              }}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={formCard}>
          <Typography variant="h6" gutterBottom>
            Order details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <DetailRow label="Product" value={order.product_name} />
            <DetailRow label="Customer" value={order.customer_name} />
            <DetailRow label="Delivery address" value={order.delivery_address} />
            <DetailRow label="Quantity" value={order.quantity} />
            <DetailRow
              label="Price per item"
              value={`$${order.price_per_item.toFixed(2)}`}
            />
            <DetailRow
              label="Total"
              value={`$${(order.quantity * order.price_per_item).toFixed(2)}`}
            />
            <DetailRow
              label="Last updated"
              value={
                order.updated_at
                  ? new Date(order.updated_at).toLocaleString()
                  : "-"
              }
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="body2"
        sx={{ width: 160, color: "text.secondary", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
