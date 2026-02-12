import * as React from 'react';
import { useTheme, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

/** Semantic chart color: component resolves from theme (light/dark). */
export type StatCardChartVariant = 'default' | 'error' | 'neutral';

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  /** When omitted, derived from data (first half vs second half of series). */
  trend?: 'up' | 'down' | 'neutral';
  /** When omitted, derived from data (e.g. "+12%" or "new"). */
  trendLabel?: string;
  data: number[];
  /** x-axis labels; must match data length (e.g. 7 labels for 7d interval). */
  xAxisData?: string[];
  /** Semantic chart color. When set, line/area use theme color (e.g. error=red, neutral=gray). When unset, uses trend-based color. */
  chartVariant?: StatCardChartVariant;
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDefaultTrendLabel(trend: 'up' | 'down' | 'neutral'): string {
  const trendValues = { up: '+25%', down: '-25%', neutral: '+0%' };
  return trendValues[trend];
}

/** Derives trend from series: first half (days 0–2) vs second half (days 3–6). */
function getTrendFromSeries(
  byDay: number[]
): { trend: 'up' | 'down' | 'neutral'; trendLabel: string } {
  if (!byDay || byDay.length < 7) {
    return { trend: 'neutral', trendLabel: '—' };
  }
  const firstHalf = byDay[0] + byDay[1] + byDay[2];
  const secondHalf = byDay[3] + byDay[4] + byDay[5] + byDay[6];
  if (firstHalf === 0) {
    return {
      trend: secondHalf > 0 ? 'up' : 'neutral',
      trendLabel: secondHalf > 0 ? 'new' : '+0%',
    };
  }
  const pct = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  return {
    trend: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
    trendLabel: pct >= 0 ? `+${pct}%` : `${pct}%`,
  };
}

function getChartColorFromVariant(variant: StatCardChartVariant, theme: Theme): string {
  const isLight = theme.palette.mode === 'light';
  switch (variant) {
    case 'error':
      return isLight ? theme.palette.error.main : theme.palette.error.dark;
    case 'neutral': {
      const grey = theme.palette.grey as unknown as Record<number, string>;
      return isLight ? grey[500] : grey[600];
    }
    default:
      return '';
  }
}

export default function StatCard({
  title,
  value,
  interval,
  trend: trendProp,
  trendLabel: trendLabelProp,
  data,
  xAxisData,
  chartVariant,
}: StatCardProps) {
  const theme = useTheme();
  const derivedTrend = React.useMemo(() => getTrendFromSeries(data), [data]);
  const trend = trendProp ?? derivedTrend.trend;
  const trendLabel = trendLabelProp ?? derivedTrend.trendLabel;

  const chartLabels = xAxisData != null && xAxisData.length === data.length
    ? xAxisData
    : data.map((_, i) => `${i + 1}`);

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const color = labelColors[trend];
  const variantColor = chartVariant ? getChartColorFromVariant(chartVariant, theme) : '';
  const chartColor = variantColor || trendColors[trend];
  const chipLabel = trendLabel || getDefaultTrendLabel(trend);
  const gradientId = `area-gradient-${title}-${value}`;

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={color} label={chipLabel} />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              color={chartColor}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: chartLabels,
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#${gradientId}) !important`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={gradientId} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}