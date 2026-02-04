"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ORDER_STATUS, type OrderStatus } from "@/types";
import type { Order } from "@/types";
import { getOrderById, updateOrder } from "@/app/actions/orders";
import {
  pageLayout,
  pageContentForm,
  loadingContainer,
  errorContainer,
  formCard,
} from "@/styles/page-layout";

export default function EditOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    product_name: "",
    customer_name: "",
    delivery_address: "",
    quantity: 1,
    price_per_item: 0,
    status: (ORDER_STATUS[0] ?? "CREATED") as OrderStatus,
  });

  React.useEffect(() => {
    const id = params.id;
    if (!id) return;

    const idNum = Number(id);
    if (Number.isNaN(idNum)) return;

    let isMounted = true;

    async function load() {
      try {
        const data = await getOrderById(idNum);
        if (!isMounted) return;
        if (data) {
          setOrder(data);
          setForm({
            product_name: data.product_name,
            customer_name: data.customer_name,
            delivery_address: data.delivery_address,
            quantity: data.quantity,
            price_per_item: data.price_per_item,
            status: data.status,
          });
        } else {
          setError("Failed to load order.");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load order.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  function handleChange<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!order) return;
    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateOrder(order.id, {
        product_name: form.product_name,
        customer_name: form.customer_name,
        delivery_address: form.delivery_address,
        quantity: Number(form.quantity),
        price_per_item: Number(form.price_per_item),
        status: form.status,
      });

      if (!updated) {
        setError("Failed to update order. Please check your input.");
        setSubmitting(false);
        return;
      }

      router.push(`/orders/${order.id}`);
    } catch (err) {
      console.error("Failed to update order", err);
      setError("Something went wrong while updating the order.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !order) {
    return (
      <Box sx={errorContainer}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={() => router.push("/orders")}>
          Back to orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentForm}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit order #{order.id}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Update the order details below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={formCard}>
          <Stack spacing={2.5}>
            <TextField
              label="Product name"
              value={form.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Customer name"
              value={form.customer_name}
              onChange={(e) => handleChange("customer_name", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Delivery address"
              value={form.delivery_address}
              onChange={(e) =>
                handleChange("delivery_address", e.target.value)
              }
              required
              fullWidth
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value) || 0)
                }
                required
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Price per item"
                type="number"
                value={form.price_per_item}
                onChange={(e) =>
                  handleChange("price_per_item", Number(e.target.value) || 0)
                }
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Stack>
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={(e) =>
                handleChange("status", e.target.value as OrderStatus)
              }
              fullWidth
            >
              {ORDER_STATUS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="button"
                variant="text"
                onClick={() => router.push(`/orders/${order.id}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
