import { Box, Stack, Typography } from "@mui/material";

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
    </Stack>
  );
}
