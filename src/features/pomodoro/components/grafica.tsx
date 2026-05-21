"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { type ChartConfig, ChartContainer } from "@/components/evilcharts/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/evilcharts/ui";
import type { DefaultTooltipContentProps } from "recharts";
import type { PomodoroChartDay } from "@/features/pomodoro/lib/pomodoroCookies";

const chartConfig = {
  pomodoros: {
    label: "Pomodoros",
    colors: {
      light: ["#5b4ee0"],
      dark: ["#7c6ef6"],
    },
  },
} satisfies ChartConfig;

const DX = 10;
const DY = 10;
const BEVEL_OPACITY = 0.55;
const FILLED = true;
const DIRECTION: "left" | "right" = "right";
const HIGHLIGHT_COLOR = "#22c55e";
const HIGHLIGHT_COLOR_DARK = "#15803d";

interface ShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: { label: string; pomodoros: number };
}

function IsoBar({
  x,
  y,
  width,
  height,
  index,
  payload,
  maxValue,
  idPrefix,
}: ShapeProps & { maxValue: number; idPrefix: string }) {
  const bx = Number(x ?? 0);
  const by = Number(y ?? 0);
  const bw = Number(width ?? 0);
  const bh = Number(height ?? 0);

  if (bh <= 0) return null;

  const highlight = maxValue > 0 && payload?.pomodoros === maxValue;
  const dx = DIRECTION === "left" ? -DX : DX;
  const sideX = DIRECTION === "left" ? bx : bx + bw;
  const topPoints = `${bx},${by} ${bx + bw},${by} ${bx + bw + dx},${by - DY} ${bx + dx},${by - DY}`;
  const sidePoints = `${sideX},${by} ${sideX + dx},${by - DY} ${sideX + dx},${by + bh - DY} ${sideX},${by + bh}`;

  const url = (name: string) => `url(#${idPrefix}-${name})`;
  const strokeColor = highlight ? HIGHLIGHT_COLOR_DARK : "var(--color-accent)";

  const frontFill = FILLED
    ? highlight
      ? url("iso-front-accent")
      : url("iso-front-base")
    : "none";
  const topFill = FILLED
    ? highlight
      ? url("iso-top-accent")
      : url("iso-top-base")
    : "none";
  const rightFill = FILLED
    ? highlight
      ? url("iso-right-accent")
      : url("iso-right-base")
    : "none";
  const hatchFill = highlight ? url("iso-hatch-accent") : url("iso-hatch-base");

  return (
    <motion.g
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{
        duration: 0.7,
        delay: (index ?? 0) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
    >
      <polygon
        points={sidePoints}
        fill={rightFill}
        stroke={strokeColor}
        strokeWidth={FILLED ? 0 : 1}
      />
      <polygon
        points={topPoints}
        fill={topFill}
        stroke={strokeColor}
        strokeWidth={FILLED ? 0 : 1}
      />
      <rect
        x={bx}
        y={by}
        width={bw}
        height={bh}
        fill={frontFill}
        stroke={strokeColor}
        strokeWidth={FILLED ? 0 : 1}
      />
      {FILLED && <rect x={bx} y={by} width={bw} height={bh} fill={hatchFill} />}
      {FILLED && highlight && (
        <rect x={bx} y={by} width={2} height={bh} fill="rgba(0,0,0,0.15)" />
      )}
    </motion.g>
  );
}

function IsoBarDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-iso-front-base`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={1} />
        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.8} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-iso-top-base`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={BEVEL_OPACITY} />
        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={BEVEL_OPACITY * 0.9} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-iso-right-base`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={BEVEL_OPACITY * 0.7} />
        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={BEVEL_OPACITY * 0.55} />
      </linearGradient>

      <linearGradient id={`${idPrefix}-iso-front-accent`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={HIGHLIGHT_COLOR} stopOpacity={1} />
        <stop offset="100%" stopColor={HIGHLIGHT_COLOR_DARK} stopOpacity={0.95} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-iso-top-accent`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={HIGHLIGHT_COLOR} stopOpacity={BEVEL_OPACITY + 0.15} />
        <stop offset="100%" stopColor={HIGHLIGHT_COLOR} stopOpacity={BEVEL_OPACITY} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-iso-right-accent`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={HIGHLIGHT_COLOR_DARK} stopOpacity={BEVEL_OPACITY + 0.05} />
        <stop offset="100%" stopColor={HIGHLIGHT_COLOR_DARK} stopOpacity={BEVEL_OPACITY * 0.7} />
      </linearGradient>

      <pattern
        id={`${idPrefix}-iso-hatch-base`}
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      </pattern>
      <pattern
        id={`${idPrefix}-iso-hatch-accent`}
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="6" stroke={HIGHLIGHT_COLOR_DARK} strokeWidth="1" strokeOpacity="0.15" />
      </pattern>
    </defs>
  );
}

type PomodoroIsometricChartProps = {
  data: PomodoroChartDay[];
  total: number;
  peakLabel: string;
  peakCount: number;
};

export function PomodoroIsometricChart({
  data,
  total,
  peakLabel,
  peakCount,
}: PomodoroIsometricChartProps) {
  const idPrefix = React.useId().replace(/:/g, "");

  const maxValue = React.useMemo(
    () => data.reduce((m, d) => (d.pomodoros > m ? d.pomodoros : m), 0),
    [data],
  );

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div className="flex flex-col gap-2">
            <span className="text-muted font-mono text-xs">[Σ] Total (7 días)</span>
            <span className="text-text font-mono text-3xl tracking-tighter">{total}</span>
          </div>
          <hr className="border-border mx-4 h-full border-l border-dashed" />
          <div className="flex flex-col gap-2">
            <span className="text-muted font-mono text-xs">[⬆] Mejor día</span>
            <span className="text-text font-mono text-3xl tracking-tighter capitalize">
              {peakCount > 0 ? `${peakLabel} (${peakCount})` : "—"}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-1">
          <span className="text-muted font-mono text-[10px]">
            {"// BLOQUE: "}
            <span className="text-text">TRABAJO</span>
          </span>
          <span className="text-muted font-mono text-[10px]">
            {"// DESTACADO: "}
            <span className="text-text">MÁXIMO</span>
          </span>
        </div>
      </div>
      <hr className="border-border my-4 border-t border-dashed" />
      <ChartContainer config={chartConfig} className="min-h-[220px]">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
          barCategoryGap="25%"
        >
          <IsoBarDefs idPrefix={idPrefix} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <YAxis hide domain={[0, Math.max(maxValue + 1, 4)]} allowDecimals={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(
                  value: Parameters<
                    NonNullable<DefaultTooltipContentProps["formatter"]>
                  >[0],
                  name: Parameters<
                    NonNullable<DefaultTooltipContentProps["formatter"]>
                  >[1],
                ) => (
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className="size-2.5 shrink-0 rounded-[2px]"
                      style={{ background: "var(--color-pomodoros-0)" }}
                    />
                    <span className="text-muted flex-1 capitalize">{String(name ?? "pomodoros")}</span>
                    <span className="text-text font-mono font-medium tabular-nums">
                      {value ?? 0}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="pomodoros"
            isAnimationActive={false}
            shape={(props: unknown) => (
              <IsoBar {...(props as ShapeProps)} maxValue={maxValue} idPrefix={idPrefix} />
            )}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
