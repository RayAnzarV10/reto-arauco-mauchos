"use client";

import type { ChartSeries } from "@/lib/api";

interface Props {
  series: ChartSeries;
  dark?: boolean;
}

export default function BarChart({ series, dark = false }: Props) {
  const max = Math.max(...series.data.map((d) => d.value));

  if (dark) {
    return (
      <div className="flex flex-col flex-1 justify-end gap-1 h-44">
        <div className="flex items-end gap-2 h-full">
          {series.data.map((point) => (
            <div key={point.name} className="flex flex-col items-center flex-1 gap-1.5">
              <div
                className="w-full rounded-t-md transition-all duration-500 bg-white/20 hover:bg-emerald-400/60 cursor-default"
                style={{ height: `${(point.value / max) * 100}%` }}
                title={`${point.value}`}
              />
              <span className="text-[10px] text-gray-500 truncate w-full text-center">
                {point.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{series.title}</h3>
      <div className="flex items-end gap-2 h-40">
        {series.data.map((point) => (
          <div key={point.name} className="flex flex-col items-center flex-1 gap-1">
            <div
              className="w-full bg-emerald-500 rounded-t-md transition-all duration-500 hover:bg-emerald-400 cursor-default"
              style={{ height: `${(point.value / max) * 100}%` }}
              title={`${point.value}`}
            />
            <span className="text-[10px] text-gray-400 truncate w-full text-center">
              {point.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
