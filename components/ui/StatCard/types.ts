export type StatCardChartVariant = "default" | "error" | "neutral";

export type StatCardTrend = "up" | "down" | "neutral";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend?: StatCardTrend;
  trendLabel?: string;
  data: number[];
  xAxisData?: string[];
  chartVariant?: StatCardChartVariant;
};
