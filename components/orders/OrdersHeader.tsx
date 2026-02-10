import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";

export function OrdersHeader() {
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
      <Button component={Link} href="/orders/create" variant="contained" color="primary">
        Create order
      </Button>
    </Stack>
  );
}