import type { SxProps, Theme } from "@mui/material";
import type { OrderStatus } from "@/types";

/** MUI color for Chip / status indicator by order status */
export const ORDER_STATUS_COLOR: Record<
  OrderStatus,
  "default" | "primary" | "success" | "error" | "info" | "warning"
> = {
  CREATED: "default",
  PROCESSING: "info",
  SHIPPED: "primary",
  DELIVERED: "success",
  CANCELED: "error",
};

/** Sx props for an outlined Select showing order status (border + text color by status) */
export function getStatusSelectSx(status: OrderStatus): SxProps<Theme> {
  const base: SxProps<Theme> = {
    minWidth: 140,
    fontWeight: 600,
    "& .MuiSelect-select": { py: 0.75 },
  };
  const byStatus: Record<OrderStatus, SxProps<Theme>> = {
    CREATED: {
      borderColor: "grey.400",
      color: "grey.700",
      "&:hover": { borderColor: "grey.600" },
    },
    PROCESSING: {
      borderColor: "info.main",
      color: "info.dark",
      "&:hover": { borderColor: "info.dark" },
    },
    SHIPPED: {
      borderColor: "primary.main",
      color: "primary.dark",
      "&:hover": { borderColor: "primary.dark" },
    },
    DELIVERED: {
      borderColor: "success.main",
      color: "success.dark",
      "&:hover": { borderColor: "success.dark" },
    },
    CANCELED: {
      borderColor: "error.main",
      color: "error.dark",
      "&:hover": { borderColor: "error.dark" },
    },
  };
  return { ...base, ...byStatus[status] };
}
