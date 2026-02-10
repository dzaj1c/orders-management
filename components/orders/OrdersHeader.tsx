import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography } from "@mui/material";

interface OrdersHeaderProps {
  onAddOrder?: () => void;
  isAddingRow?: boolean;
}

export function OrdersHeader({ onAddOrder, isAddingRow }: OrdersHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage customer orders and view their current status.
        </Typography>
      </Box>
      <Stack direction="row" gap={1}>
        {onAddOrder != null && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onAddOrder}
            disabled={isAddingRow}
            startIcon={<AddIcon />}
          >
            Add inline
          </Button>
        )}
        <Button component={Link} href="/orders/create" variant="contained" color="primary">
          Create order
        </Button>
      </Stack>
    </Stack>
  );
}