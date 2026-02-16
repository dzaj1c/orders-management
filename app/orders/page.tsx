"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { pageLayout, pageContentList } from "@/styles/page-layout";
import { CustomGrid } from "@/components/ui/custom-grid";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard } from "@/components/ui/StatCard";
import { useOrdersStats, useOrdersList, useOrdersCrud, useOrdersGrid } from "@/hooks/orders";
import type { Order } from "@/types";

export default function OrdersPage() {
  const router = useRouter();

  const { stats } = useOrdersStats();
  const list = useOrdersList();
  const crud = useOrdersCrud({ setError: list.setError });

  const gridCrud = {
    ...crud,
    onView: (id: number) => router.push(`/orders/${id}`),
  };

  const gridProps = useOrdersGrid({ loadData: list.loadPage, crud: gridCrud });

  const cards = stats ? (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap" alignItems="stretch">
      <StatCard
        title="Delivered orders"
        value={String(stats.deliveredTotal)}
        interval="Last 7 days"
        xAxisData={stats.last7DaysLabels}
        data={stats.deliveredByDay}
      />
      <StatCard
        title="Canceled deliveries"
        value={String(stats.canceledTotal)}
        interval="Last 7 days"
        xAxisData={stats.last7DaysLabels}
        data={stats.canceledByDay}
        chartVariant="error"
      />
      <StatCard
        title="Delivered customers"
        value={String(stats.deliveredCustomers)}
        interval="Last 7 days"
        xAxisData={stats.last7DaysLabels}
        data={stats.deliveredCustomersByDay}
        chartVariant="neutral"
      />
      <Card variant="outlined" sx={{ flexGrow: 1, minWidth: 200 }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            AI insights
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            disabled
          >
            Get insights
          </Button>
        </CardContent>
      </Card>
    </Stack>
  ) : null;

  return (
    <Box sx={pageLayout}>
      <Box sx={pageContentList}>
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
        {cards} 
        {list.error ? (
          <ErrorState message={list.error} />
        ) : (
          <CustomGrid<Order> {...gridProps} />
        )}
      </Box>
    </Box>
  );
}
