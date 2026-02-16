import type { Theme } from "@mui/material/styles";
import type { StatCardChartVariant, StatCardTrend } from "./types";
import { DEFAULT_TREND_LABELS } from "./constants";

export function getDefaultTrendLabel(trend: StatCardTrend): string {
  return DEFAULT_TREND_LABELS[trend];
}

export function getTrendFromSeries(
  byDay: number[]
): { trend: StatCardTrend; trendLabel: string } {
  if (!byDay || byDay.length < 7) {
    return { trend: "neutral", trendLabel: "—" };
  }
  const firstHalf = byDay[0] + byDay[1] + byDay[2];
  const secondHalf = byDay[3] + byDay[4] + byDay[5] + byDay[6];
  if (firstHalf === 0) {
    return {
      trend: secondHalf > 0 ? "up" : "neutral",
      trendLabel: secondHalf > 0 ? "new" : "+0%",
    };
  }
  const pct = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  return {
    trend: pct > 0 ? "up" : pct < 0 ? "down" : "neutral",
    trendLabel: pct >= 0 ? `+${pct}%` : `${pct}%`,
  };
}

export function getChartColorFromVariant(
  variant: StatCardChartVariant,
  theme: Theme
): string {
  const isLight = theme.palette.mode === "light";
  switch (variant) {
    case "error":
      return isLight ? theme.palette.error.main : theme.palette.error.dark;
    case "neutral": {
      const grey = theme.palette.grey as unknown as Record<number, string>;
      return isLight ? grey[500] : grey[600];
    }
    default:
      return "";
  }
}
