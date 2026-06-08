"use client";

import { useState } from "react";
import { usePresentationCtx } from "./PresentationContext";

// ── Shared data ───────────────────────────────────────────────────────────────
const CHAIN = [
  { label: "Ormuz", sub: "Origen del choque", color: "border-red-500 bg-red-900/40 text-red-200" },
  { label: "Petróleo & Gas", sub: "Brent ~$120/bbl pico", color: "border-orange-400 bg-orange-900/40 text-orange-200" },
  { label: "Metanol & NH₃", sub: "+doble dígito Asia", color: "border-amber-400 bg-amber-900/40 text-amber-200" },
  { label: "Urea & Melamina", sub: ">$700/t (BM)", color: "border-yellow-500 bg-yellow-900/40 text-yellow-200" },
  { label: "Resinas UF/MUF", sub: "Formaldehído +", color: "border-gray-500 bg-gray-800 text-gray-300" },
  { label: "MDF & Tableros", sub: "Costo en USD", color: "border-gray-500 bg-gray-700 text-gray-300" },
  { label: "USD / MXN", sub: "Presión cambiaria", color: "border-emerald-500 bg-emerald-900/40 text-emerald-200" },
];

const HIGH_RISKS = [
  { name: "Volatilidad USD/MXN", detail: "Choque energético activa depreciación + inflación de importados", impact: "Alto", prob: "Alta" },
  { name: "Depreciación + suba simultánea de insumos", detail: "El escenario más dañino: el dólar sube al mismo tiempo que urea y metanol", impact: "Alto", prob: "Media" },
  { name: "Precio urea y metanol", detail: "Urea puede superar $700/t si el choque persiste (Banco Mundial)", impact: "Alto", prob: "Alta" },
  { name: "CAPEX en dólares (Vikingo 2.0 / Alacrán)", detail: "US$404M expuesto. +$1 MXN/USD = +$404M MXN de sobrecosto antes de coberturas", impact: "Alto", prob: "Media" },
];

const LAYERS = [
  { pct: 50, label: "Forward OTC", notional: "10,443,900 USD", fn: "Fija tipo de cambio en F = 17.7095 · sin prima", color: "bg-blue-400" },
  { pct: 20, label: "Bull Call Spread", notional: "4,177,560 USD", fn: "Protección K₁=18.00 – K₂=19.00 · prima 1.09 M MXN", color: "bg-emerald-400" },
  { pct: 30, label: "Abierto", notional: "6,266,340 USD", fn: "Preserva beneficio si el peso se aprecia", color: "bg-gray-500" },
];

type Instrument = "forward" | "vanilla" | "spread" | "sintetico";

const PNL = [
  { st: 16.50, label: "Peso fuerte", sinCob: 19.975, forward: 2.291, vanilla: 14.258, spread: 16.040, sintetico: 2.291, hibrida: 6.219 },
  { st: 17.50, label: "Base", sinCob: -0.913, forward: -3.976, vanilla: -6.630, spread: -4.847, sintetico: -3.976, hibrida: -4.225 },
  { st: 18.00, label: "Estrés moderado", sinCob: -11.357, forward: -7.109, vanilla: -17.074, spread: -15.291, sintetico: -7.109, hibrida: -9.447 },
  { st: 19.00, label: "Estrés alto", sinCob: -32.244, forward: -13.375, vanilla: -23.340, spread: -21.558, sintetico: -13.375, hibrida: -15.713 },
  { st: 20.00, label: "Escenario crítico", sinCob: -53.132, forward: -19.642, vanilla: -29.606, spread: -42.446, sintetico: -19.642, hibrida: -26.157 },
];

const INST_OPTS: { key: Instrument; label: string }[] = [
  { key: "forward", label: "Forward" },
  { key: "vanilla", label: "Vanilla" },
  { key: "spread", label: "Bull Spread" },
  { key: "sintetico", label: "Sintético" },
];

function fmtM(v: number) {
  const abs = Math.abs(v).toFixed(1) + " M";
  return v < 0 ? `(${abs})` : `+${abs}`;
}

function pnlColor(v: number) {
  return v >= 0 ? "text-emerald-400" : v < -30 ? "text-red-400" : "text-red-300";
}

// ── Slides ────────────────────────────────────────────────────────────────────
function SlideTransmission() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 px-10">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase mb-2">
          Slide 1 · Contexto macroeconómico
        </p>
        <h2 className="text-5xl font-bold text-white leading-tight">
          Cadena de Transmisión
        </h2>
        <p className="mt-3 text-lg text-gray-400">
          Del conflicto en el estrecho de Ormuz al tipo de cambio USD/MXN
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center max-w-5xl w-full">
        {CHAIN.map((node, i) => (
          <div key={i} className="flex items-center gap-2 flex-none">
            <div className={`rounded-xl border-l-4 px-4 py-3 min-w-[110px] ${node.color}`}>
              <p className="text-sm font-bold leading-snug">{node.label}</p>
              <p className="text-[11px] opacity-60 mt-0.5">{node.sub}</p>
            </div>
            {i < CHAIN.length - 1 && (
              <span className="text-gray-600 text-xl">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          { label: "Canal insumos", val: "US$3.48 M/mes", note: "Urea + Metanol expuestos", color: "border-red-500/30 bg-red-500/10" },
          { label: "Canal logístico", val: "+17.9% YoY", note: "Brent vs base $72/bbl", color: "border-amber-500/30 bg-amber-500/10" },
          { label: "Canal cambiario", val: "US$20.88 M", note: "Exposición total 6M", color: "border-blue-500/30 bg-blue-500/10" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border px-5 py-4 text-center ${c.color}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{c.val}</p>
            <p className="text-[11px] text-gray-500 mt-1">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideRisks() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-10 max-w-5xl mx-auto w-full">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase mb-2">
          Slide 2 · Amenazas identificadas
        </p>
        <h2 className="text-5xl font-bold text-white leading-tight">
          Riesgos Críticos
        </h2>
        <p className="mt-3 text-lg text-gray-400">
          Impacto Alto · Probabilidad Alta o Media
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {HIGH_RISKS.map((r, i) => (
          <div key={i} className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <p className="text-white font-semibold leading-snug">{r.name}</p>
              <div className="flex gap-1.5 shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                  I: {r.impact}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.prob === "Alta" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>
                  P: {r.prob}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{r.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] px-6 py-3 w-full">
        <p className="text-sm text-gray-300 text-center">
          El escenario más dañino combina <span className="text-red-300 font-semibold">depreciación cambiaria + suba de insumos simultánea</span>
          — ambos correlacionados con el mismo choque energético.
        </p>
      </div>
    </div>
  );
}

function SlideStrategy() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-10 max-w-4xl mx-auto w-full">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase mb-2">
          Slide 3 · Solución propuesta
        </p>
        <h2 className="text-5xl font-bold text-white leading-tight">
          Estrategia Híbrida 50/20/30
        </h2>
        <p className="mt-3 text-lg text-gray-400">
          Forward + Bull Call Spread + Exposición abierta sobre US$20.88 M
        </p>
      </div>

      <div className="w-full space-y-5">
        {LAYERS.map((layer) => (
          <div key={layer.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">{layer.label}</p>
                <p className="text-gray-400 text-sm">{layer.fn}</p>
                <p className="text-gray-600 text-xs">{layer.notional}</p>
              </div>
              <p className="text-4xl font-bold text-white">{layer.pct}%</p>
            </div>
            <div className="h-3 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${layer.color}`}
                style={{ width: `${layer.pct * 2}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { label: "Exposición cubierta", value: "70%", sub: "14,621,460 USD" },
          { label: "Prima total", value: "1.09 M MXN", sub: "vs 5.54 M de la vanilla" },
          { label: "Costo / notional", value: "0.43%", sub: "óptimo riesgo-costo" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlidePnl() {
  const [selected, setSelected] = useState<Instrument>("forward");

  const critRow = PNL.find((r) => r.st === 20.0)!;
  const saving = critRow.sinCob - critRow.hibrida; // 26.975 M
  const diff = critRow.hibrida - critRow[selected];
  const hybridWins = diff >= 0;

  const instLabel = INST_OPTS.find((o) => o.key === selected)!.label;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-10 max-w-5xl mx-auto w-full">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase mb-2">
          Slide 4 · Resultados
        </p>
        <h2 className="text-4xl font-bold text-white leading-tight">
          P&amp;L por Escenario
        </h2>
      </div>

      <div className="flex gap-1 bg-white/[0.06] rounded-xl p-1 self-center">
        {INST_OPTS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            className={`text-xs font-semibold rounded-lg px-4 py-2 transition-all ${
              selected === opt.key
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Escenario
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Sin cobertura
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Híbrida ★
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                {instLabel}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {PNL.map((row) => {
              const isCrit = row.st === 20.0;
              const isBase = row.st === 17.5;
              const bg = isCrit
                ? "bg-red-500/10"
                : isBase
                ? "bg-emerald-500/[0.07]"
                : "";
              return (
                <tr key={row.st} className={bg}>
                  <td className="px-5 py-3">
                    <p className={`font-bold ${isCrit ? "text-red-300" : isBase ? "text-emerald-300" : "text-white"}`}>
                      {row.st.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{row.label}</p>
                  </td>
                  <td className={`px-5 py-3 text-right font-mono ${pnlColor(row.sinCob)}`}>
                    {fmtM(row.sinCob)}
                  </td>
                  <td className={`px-5 py-3 text-right font-mono font-bold ${pnlColor(row.hibrida)}`}>
                    {fmtM(row.hibrida)}
                  </td>
                  <td className={`px-5 py-3 text-right font-mono text-blue-300`}>
                    {fmtM(row[selected])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 w-full">
        <p className="text-sm text-emerald-200 leading-relaxed">
          Escenario crítico (ST=20.00): la híbrida reduce la pérdida en{" "}
          <span className="font-bold text-white">{saving.toFixed(2)} M MXN</span>{" "}
          vs sin cobertura.{" "}
          {hybridWins ? (
            <>
              Frente a <span className="font-semibold text-blue-300">{instLabel}</span>,
              la híbrida genera{" "}
              <span className="font-bold text-emerald-300">{Math.abs(diff).toFixed(2)} M MXN</span> menos pérdida.
            </>
          ) : (
            <>
              Frente a <span className="font-semibold text-blue-300">{instLabel}</span>, la híbrida tiene{" "}
              <span className="font-bold text-amber-300">{Math.abs(diff).toFixed(2)} M MXN</span> más pérdida
              pero su prima es <span className="text-white font-semibold">5× menor</span>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function SlideConclusion() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-10 max-w-4xl mx-auto w-full">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase mb-2">
          Slide 5 · Recomendación
        </p>
        <h2 className="text-5xl font-bold text-white leading-tight">Conclusión</h2>
        <p className="mt-3 text-lg text-gray-400">
          Estrategia de cobertura óptima · ARAUCO México Jun 2026
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { label: "Reducción de pérdida (SC 20.00)", value: "26.98 M MXN", sub: "vs sin cobertura", color: "text-emerald-400" },
          { label: "Prima total estrategia híbrida", value: "1.09 M MXN", sub: "0.43% del notional cubierto", color: "text-blue-300" },
          { label: "Exposición cubierta", value: "70%", sub: "US$14.62 M de US$20.88 M", color: "text-white" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight mb-2">
              {k.label}
            </p>
            <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        {[
          "Forward OTC (50%): certidumbre máxima · tipo fijado en 17.7095 para el flujo más probable",
          "Bull Call Spread (20%): protección eficiente en el rango de depreciación relevante (18.00–19.00) · prima 1.09 M MXN",
          "Abierto (30%): diferencial Banxico-Fed de 287.5 pb sostiene carry trade · sesgo apreciativo del MXN en horizonte 6M",
          "La estrategia supera a la vanilla en costo (1.09 vs 5.54 M MXN) con protección adecuada en escenario base",
        ].map((point, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3"
          >
            <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Orchestrator ──────────────────────────────────────────────────────────────
const SLIDES = [SlideTransmission, SlideRisks, SlideStrategy, SlidePnl, SlideConclusion];
const SLIDE_TITLES = [
  "Cadena de Transmisión",
  "Riesgos Críticos",
  "Estrategia 50/20/30",
  "P&L Simplificado",
  "Conclusión",
];

export function PresentationOverlay() {
  const { isPresenting, currentSlide, totalSlides, exitPresentation, nextSlide, prevSlide } =
    usePresentationCtx();

  if (!isPresenting) return null;

  const SlideComponent = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/[0.07] shrink-0">
        <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-600 uppercase">
          ARAUCO México · Reto 2026 · Equipo 5
        </p>
        <p className="text-sm font-medium text-gray-400">{SLIDE_TITLES[currentSlide]}</p>
        <button
          onClick={exitPresentation}
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          ✕ Salir
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 overflow-hidden">
        <SlideComponent />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-white/[0.07] shrink-0">
        <p className="text-xs text-gray-700">← → navegar · Esc salir</p>

        <div className="flex items-center gap-3">
          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i === currentSlide
                    ? "h-2 w-5 bg-white"
                    : "h-2 w-2 bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="h-9 w-9 rounded-full border border-white/[0.10] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-lg"
          >
            ←
          </button>
          <span className="text-sm font-bold text-white tabular-nums">
            {currentSlide + 1}{" "}
            <span className="text-gray-600">/ {totalSlides}</span>
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="h-9 w-9 rounded-full border border-white/[0.10] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-lg"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
