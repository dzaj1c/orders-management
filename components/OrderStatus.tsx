"use client";

import { Chip, MenuItem, Select } from "@mui/material";
import type { OrderStatus } from "@/types";
import { ORDER_STATUS } from "@/types";

const CHIP_COLOR: Record<
  OrderStatus,
  "default" | "primary" | "success" | "error" | "info" | "warning"
> = {
  CREATED: "default",
  PROCESSING: "info",
  SHIPPED: "primary",
  DELIVERED: "success",
  CANCELED: "error",
};

const SELECT_SX_BY_STATUS: Record<
  OrderStatus,
  { borderColor: string; color: string; "&:hover": { borderColor: string } }
> = {
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

export interface OrderStatusProps {
  status: OrderStatus;
  /** When set, renders a dropdown to change status; otherwise a read-only chip. */
  onChange?: (status: OrderStatus) => void;
  disabled?: boolean;
  size?: "small" | "medium";
}

export function OrderStatus({
  status,
  onChange,
  disabled = false,
  size = "small",
}: OrderStatusProps) {
  if (onChange) {
    const statusSx = SELECT_SX_BY_STATUS[status];
    return (
      <Select
        variant="outlined"
        size="small"
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        sx={{
          minWidth: 140,
          fontWeight: 600,
          "& .MuiSelect-select": { py: 0.75 },
          ...statusSx,
        }}
      >
        {ORDER_STATUS.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <Chip
      size={size}
      label={status}
      color={CHIP_COLOR[status]}
      variant="outlined"
    />
  );
}
