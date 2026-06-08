"use client";

import { useState } from "react";

type Instrument = "forward" | "vanilla" | "spread" | "sintetico";

const PNL = [
  { st: 16.50, label: "Peso fuerte",       sinCob: 19.975, forward: 2.291,  vanilla: 14.258, spread: 16.040, sintetico: 2.291,  hibrida: 6.219  },
  { st: 17.50, label: "Base",              sinCob: -0.913, forward: -3.976, vanilla: -6.630, spread: -4.847, sintetico: -3.976, hibrida: -4.225 },
  { st: 18.00, label: "Estrés moderado",   sinCob: -11.357,forward: -7.109, vanilla:-17.074, spread:-15.291, sintetico: -7.109, hibrida: -9.447 },
  { st: 19.00, label: "Estrés alto",       sinCob: -32.244,forward:-13.375, vanilla:-23.340, spread:-21.558, sintetico:-13.375, hibrida:-15.713 },
  { st: 20.00, label: "Escenario crítico", sinCob: -53.132,forward:-19.642, vanilla:-29.606, spread:-42.446, sintetico:-19.642, hibrida:-26.157 },
];

const INST_OPTS: { key: Instrument; label: string; shortLabel: string }[] = [
  { key: "forward",   label: "Forward OTC",     shortLabel: "Forward"   },
  { key: "vanilla",   label: "Opción Vanilla",  shortLabel: "Vanilla"   },
  { key: "spread",    label: "Bull Call Spread", shortLabel: "BCS"      },
  { key: "sintetico", label: "Sintético",        shortLabel: "Sintético" },
];

function fmtM(v: number) {
  const abs = Math.abs(v).toFixed(1) + " M";
  return v < 0 ? `(${abs})` : `+${abs}`;
}

function cellCls(v: number) {
  if (v > 0) return "text-emerald-600 font-semibold";
  if (v < -30) return "text-red-600 font-semibold";
  if (v < -10) return "text-red-500";
  return "text-gray-700";
}

export function PnlTable() {
  const [selected, setSelected] = useState<Instrument>("forward");

  const critRow = PNL.find((r) => r.st === 20.0)!;
  const saving = critRow.sinCob - critRow.hibrida;      // 26.975
  const diff   = critRow.hibrida - critRow[selected];   // hybrid vs selected at 20.00
  const hybridWins = diff >= 0;
  const instLabel = INST_OPTS.find((o) => o.key === selected)!.label;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            P&amp;L total por estrategia y escenario (M MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Valores entre paréntesis = deterioro vs. presupuesto base.
          </p>
        </div>

        {/* Instrument toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {INST_OPTS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`text-xs font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap transition-all ${
                selected === opt.key
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-semibold tracking-wider uppercase text-[10px] text-gray-400">
                ST USD/MXN
              </th>
              <th className="px-4 py-3 text-right font-semibold tracking-wider uppercase text-[10px] text-gray-400">
                Sin cobertura
              </th>
              <th className="px-4 py-3 text-right font-semibold tracking-wider uppercase text-[10px] text-emerald-600 bg-emerald-50">
                Estrategia Híbrida ★
              </th>
              <th className="px-4 py-3 text-right font-semibold tracking-wider uppercase text-[10px] text-blue-600 bg-blue-50">
                {instLabel}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PNL.map((row) => {
              const isCrit = row.st === 20.0;
              const isBase = row.st === 17.5;
              const rowBg = isCrit
                ? "bg-red-50 border-l-2 border-l-red-400"
                : isBase
                ? "bg-emerald-50/50 border-l-2 border-l-emerald-400"
                : "";
              return (
                <tr key={row.st} className={`hover:bg-gray-50 ${rowBg}`}>
                  <td className="px-4 py-3">
                    <p className={`font-bold ${isCrit ? "text-red-700" : isBase ? "text-emerald-700" : "text-gray-900"}`}>
                      {row.st.toFixed(2)}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isCrit ? "text-red-500 font-medium" : "text-gray-400"}`}>
                      {row.label}
                    </p>
                  </td>
                  <td className={`px-4 py-3 text-right text-base ${cellCls(row.sinCob)}`}>
                    {fmtM(row.sinCob)}
                  </td>
                  <td className={`px-4 py-3 text-right text-base bg-emerald-50 ${cellCls(row.hibrida)}`}>
                    {fmtM(row.hibrida)}
                  </td>
                  <td className={`px-4 py-3 text-right text-base bg-blue-50 ${cellCls(row[selected])}`}>
                    {fmtM(row[selected])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic annotation */}
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-start gap-2">
        <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">Escenario crítico (20.00):</span>{" "}
          la estrategia híbrida reduce la pérdida en{" "}
          <span className="font-bold text-emerald-700">{saving.toFixed(2)} M MXN</span>{" "}
          vs sin cobertura.{" "}
          {hybridWins ? (
            <>
              Frente a <span className="font-semibold text-blue-700">{instLabel}</span>, la híbrida ofrece{" "}
              <span className="font-bold text-emerald-700">{Math.abs(diff).toFixed(2)} M MXN</span> mayor protección.
            </>
          ) : (
            <>
              Frente a <span className="font-semibold text-blue-700">{instLabel}</span>, el costo adicional es de{" "}
              <span className="font-bold text-amber-600">{Math.abs(diff).toFixed(2)} M MXN</span> menos protección,
              pero la prima de la híbrida es{" "}
              <span className="font-semibold text-gray-800">5× menor</span>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
