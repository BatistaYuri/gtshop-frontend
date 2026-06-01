"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber } from "@/lib/utils";
import type { ReportsTimelinePoint } from "@/hooks/useReports";

type SeriesConfig = {
  key: keyof ReportsTimelinePoint;
  label: string;
  color: string;
};

const CHART_HEIGHT = 280;
const PADDING_TOP = 20;
const PADDING_RIGHT = 18;
const PADDING_BOTTOM = 34;
const PADDING_LEFT = 50;

function toSeriesValue(point: ReportsTimelinePoint, key: keyof ReportsTimelinePoint) {
  const raw = point[key];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
}

function TimelineChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-44 animate-pulse rounded-xl bg-surface-accent" />
        <div className="h-4 w-72 animate-pulse rounded-xl bg-surface-accent" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] animate-pulse rounded-[20px] bg-surface-accent" />
      </CardContent>
    </Card>
  );
}

export function ReportsTimelineChart({
  title,
  description,
  items,
  series,
  isLoading,
}: {
  title: string;
  description: string;
  items: ReportsTimelinePoint[];
  series: SeriesConfig[];
  isLoading: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => items, [items]);

  if (isLoading) {
    return <TimelineChartSkeleton />;
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <EmptyState
            title="Sem dados para o periodo"
            description="Assim que houver execucoes registradas no periodo selecionado, o grafico de tendencia aparecera aqui."
          />
        </CardContent>
      </Card>
    );
  }

  const width = Math.max(700, chartData.length * 72);
  const plotWidth = width - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const maxValue = Math.max(
    1,
    ...chartData.flatMap((point) => series.map(({ key }) => toSeriesValue(point, key))),
  );
  const hoverIndex = activeIndex ?? chartData.length - 1;
  const hoverPoint = chartData[hoverIndex];

  function xByIndex(index: number) {
    if (chartData.length === 1) {
      return PADDING_LEFT + plotWidth / 2;
    }

    return PADDING_LEFT + (index / (chartData.length - 1)) * plotWidth;
  }

  function yByValue(value: number) {
    const normalized = value / maxValue;
    return PADDING_TOP + (1 - normalized) * plotHeight;
  }

  function buildPath(key: keyof ReportsTimelinePoint) {
    return chartData
      .map((point, index) => {
        const x = xByIndex(index);
        const y = yByValue(toSeriesValue(point, key));
        return `${index === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ");
  }

  const tooltipX = xByIndex(hoverIndex);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-3">
          {series.map((item) => (
            <div key={item.label} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-foreground-soft">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="soft-scrollbar overflow-x-auto pb-2">
          <div className="relative min-w-max">
            <svg
              width={width}
              height={CHART_HEIGHT}
              className="block"
              onMouseLeave={() => setActiveIndex(null)}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const relativeX = event.clientX - bounds.left;
                const ratio = (relativeX - PADDING_LEFT) / Math.max(1, plotWidth);
                const clampedRatio = Math.min(1, Math.max(0, ratio));
                const index = Math.round(clampedRatio * Math.max(chartData.length - 1, 1));
                setActiveIndex(index);
              }}
            >
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                const y = PADDING_TOP + plotHeight * fraction;
                const value = Math.round(maxValue * (1 - fraction));

                return (
                  <g key={fraction}>
                    <line x1={PADDING_LEFT} y1={y} x2={width - PADDING_RIGHT} y2={y} stroke="rgba(20, 51, 59, 0.12)" strokeDasharray="4 4" />
                    <text x={PADDING_LEFT - 8} y={y + 4} textAnchor="end" fontSize={11} fill="rgba(86, 114, 122, 0.95)">
                      {formatNumber(value)}
                    </text>
                  </g>
                );
              })}

              <line
                x1={PADDING_LEFT}
                y1={CHART_HEIGHT - PADDING_BOTTOM}
                x2={width - PADDING_RIGHT}
                y2={CHART_HEIGHT - PADDING_BOTTOM}
                stroke="rgba(20, 51, 59, 0.2)"
              />

              {series.map((item) => (
                <path
                  key={item.label}
                  d={buildPath(item.key)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {series.map((item) => (
                <g key={`${item.label}-dots`}>
                  {chartData.map((point, index) => {
                    const x = xByIndex(index);
                    const y = yByValue(toSeriesValue(point, item.key));
                    const isActive = index === hoverIndex;

                    return (
                      <circle
                        key={`${item.label}-${point.day}`}
                        cx={x}
                        cy={y}
                        r={isActive ? 4.2 : 3}
                        fill={item.color}
                        stroke="white"
                        strokeWidth={isActive ? 2 : 1.5}
                        opacity={isActive ? 1 : 0.9}
                      />
                    );
                  })}
                </g>
              ))}

              <line
                x1={tooltipX}
                y1={PADDING_TOP}
                x2={tooltipX}
                y2={CHART_HEIGHT - PADDING_BOTTOM}
                stroke="rgba(20, 51, 59, 0.2)"
                strokeDasharray="4 5"
              />

              {chartData.map((point, index) => (
                <text
                  key={`label-${point.day}`}
                  x={xByIndex(index)}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  fontSize={11}
                  fill="rgba(86, 114, 122, 0.95)"
                >
                  {point.day}
                </text>
              ))}
            </svg>

            <div
              className="pointer-events-none absolute top-3 rounded-2xl border border-border bg-white/95 px-3 py-2 text-xs shadow-[0_12px_24px_rgba(20,51,59,0.16)]"
              style={{ left: Math.max(8, Math.min(width - 230, tooltipX - 110)) }}
            >
              <p className="font-semibold text-foreground">{hoverPoint.day}</p>
              <div className="mt-1.5 space-y-1 text-foreground-soft">
                {series.map((item) => (
                  <p key={`tooltip-${item.label}`} className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                    <strong className="text-foreground">{formatNumber(toSeriesValue(hoverPoint, item.key))}</strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
