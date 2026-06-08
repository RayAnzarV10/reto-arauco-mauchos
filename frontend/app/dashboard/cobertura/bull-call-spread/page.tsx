import { PayoffChart } from "@/components/PayoffChart";

const K1 = 18.0;
const K2 = 19.0;
const PRIMA = 3.81; // M MXN standalone
const PRIMA_HYB = 1.09; // M MXN en la híbrida (20% notional)
const N = 14_621_460; // standalone 70%
const N_HYB = 4_177_560; // 20% in hybrid

// Bruto: N × [max(ST-K1,0) - max(ST-K2,0)] in M MXN
const bruto = (st: number, n = N) =>
  (n * (Math.max(0, st - K1) - Math.max(0, st - K2))) / 1e6;

const neto = (st: number) => bruto(st) - PRIMA;

const BREAKEVEN = K1 + (PRIMA * 1e6) / N; // 18.2606

const BRUTO_SERIES = {
  label: "Payoff bruto del spread",
  color: "#059669",
  strokeWidth: 2,
  points: [16, K1, K1 + 0.001, 18.5, K2, K2 + 0.001, 20].map((x) => ({
    x,
    y: bruto(x),
  })),
};

const NETO_SERIES = {
  label: "P&L neto (tras prima)",
  color: "#d97706",
  strokeWidth: 2,
  points: [16, K1, BREAKEVEN, 18.5, K2, 20].map((x) => ({ x, y: neto(x) })),
};

// Max payoff bruto: N × (K2 - K1) = N × 1
const MAX_BRUTO = N / 1e6; // 14.62 M
const MAX_NETO = MAX_BRUTO - PRIMA; // 10.81 M

const scenarios = [
  { st: 16.5, label: "Peso fuerte" },
  { st: 18.0, label: "Strike K₁=18" },
  { st: 18.26, label: "Break-even" },
  { st: 18.5, label: "Rango de protección" },
  { st: 19.0, label: "Strike K₂=19 (tope)" },
  { st: 20.0, label: "Depreciación fuerte (topado)" },
];

export default function BullCallSpreadPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">

          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-500 uppercase">
                  Instrumento 3 · 20% de la exposición
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Protección eficiente y topada
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Bull Call Spread<br />USD/MXN
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Compra una call a K₁=18.00 y vende una call a K₂=19.00.
                La call vendida financia parte de la comprada: prima neta
                notablemente menor que una vanilla. Protección topada arriba de K₂.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-5 py-4">
              <p className="text-[10px] text-gray-500 mb-2 tracking-widest uppercase">Construcción del spread</p>
              <p className="font-mono text-sm text-emerald-300">
                Payoff = N × [MAX(S<sub>T</sub>−K₁, 0) − MAX(S<sub>T</sub>−K₂, 0)]
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                <span>K₁ (call comprada) = {K1.toFixed(2)}</span>
                <span>K₂ (call vendida) = {K2.toFixed(2)}</span>
                <span>Prima standalone = {PRIMA} M MXN</span>
                <span>Prima en híbrida = {PRIMA_HYB} M MXN</span>
                <span>Break-even = {BREAKEVEN.toFixed(4)}</span>
                <span>Payoff máximo = {MAX_BRUTO.toFixed(2)} M MXN</span>
              </div>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Parámetros del instrumento
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Call comprada K₁", value: K1.toFixed(2), unit: "USD/MXN" },
                { label: "Call vendida K₂", value: K2.toFixed(2), unit: "USD/MXN" },
                { label: "Prima standalone", value: `${PRIMA} M`, unit: "MXN · -31% vs vanilla" },
                { label: "Prima en híbrida (20%)", value: `${PRIMA_HYB} M`, unit: "MXN · 0.43% notional" },
                { label: "Payoff máximo bruto", value: `${MAX_BRUTO.toFixed(2)} M`, unit: "MXN" },
                { label: "Payoff máximo neto", value: `${MAX_NETO.toFixed(2)} M`, unit: "MXN" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3">
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                  <p className="text-base font-bold text-white mt-0.5">{m.value}</p>
                  <p className="text-[10px] text-gray-600">{m.unit}</p>
                </div>
              ))}
            </div>

            {/* Comportamiento por rango */}
            <div className="space-y-2">
              {[
                { range: `ST < ${K1}`, behavior: "Spread expira sin valor. ARAUCO conserva beneficio de un peso fuerte.", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
                { range: `${K1} ≤ ST ≤ ${K2}`, behavior: "Protección crece linealmente. Rango de mayor relevancia.", color: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
                { range: `ST > ${K2}`, behavior: "Protección queda topada en el máximo.", color: "bg-amber-500/10 border-amber-500/20 text-amber-300" },
              ].map((r) => (
                <div key={r.range} className={`rounded-xl border px-3 py-2 ${r.color.split(" ").slice(0, 2).join(" ")}`}>
                  <p className={`text-[10px] font-mono font-bold ${r.color.split(" ")[2]}`}>{r.range}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{r.behavior}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Payoff bruto y P&amp;L neto — Bull Call Spread (M MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Forma de "Z" topada. Pérdida limitada a la prima antes de K₁. Crecimiento lineal entre K₁ y K₂. Tope por encima de K₂.
          </p>
        </div>
        <div className="px-4 py-4">
          <PayoffChart
            id="spread-chart"
            series={[BRUTO_SERIES, NETO_SERIES]}
            xDomain={[16, 20]}
            yDomain={[-6, 18]}
            xTicks={[16, 17, 18, 19, 20]}
            yTicks={[-5, 0, 5, 10, 15]}
            refLines={[
              { x: K1, label: `K₁=${K1}` },
              { x: K2, label: `K₂=${K2}` },
              { x: BREAKEVEN, label: `B/E` },
            ]}
            height={230}
          />
        </div>
      </div>

      {/* ── Scenarios ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          Resultado por escenario (standalone, N = 14,621,460 USD)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {scenarios.map((s) => {
            const b = bruto(s.st);
            const n = neto(s.st);
            const isPos = n >= 0;
            return (
              <div key={s.st} className={`rounded-2xl border p-4 flex flex-col gap-1 ${isPos ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
                <p className={`text-[10px] font-semibold ${isPos ? "text-emerald-600" : "text-gray-500"}`}>
                  {s.st.toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">{s.label}</p>
                <div className="mt-1">
                  <p className="text-[10px] text-gray-400">Bruto</p>
                  <p className="text-sm font-bold text-gray-700">+{b.toFixed(1)} M</p>
                  <p className="text-[10px] text-gray-400 mt-1">Neto</p>
                  <p className={`text-sm font-bold ${isPos ? "text-emerald-700" : "text-red-600"}`}>
                    {n >= 0 ? "+" : ""}{n.toFixed(1)} M
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Por qué spread y no collar ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            ¿Por qué Bull Call Spread y no Collar?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6">
            <p className="text-sm font-bold text-gray-900 mb-2">Collar (alternativa descartada)</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Un collar reduce la prima vendiendo una put, pero esa put <strong className="text-red-600">limita el beneficio</strong> de
              ARAUCO si el peso se aprecia, obligando a la empresa a renunciar a un escenario favorable.
            </p>
            <ul className="space-y-1">
              {["Limita upside si MXN se aprecia", "ARAUCO pierde beneficio en escenario positivo", "Venta de put genera obligación bilateral"].map(v => (
                <li key={v} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-red-400 shrink-0">✗</span>{v}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6">
            <p className="text-sm font-bold text-gray-900 mb-2">Bull Call Spread (recomendado)</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Preserva el beneficio de una apreciación del peso (no vende put) y limita <strong className="text-emerald-600">únicamente
              la protección en escenarios de depreciación elevada</strong> (arriba de K₂=19).
            </p>
            <ul className="space-y-1">
              {["Conserva upside si MXN se aprecia", "Prima neta reducida vs vanilla", "Sin obligación de comprar a precio desfavorable"].map(v => (
                <li key={v} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-emerald-500 shrink-0">✓</span>{v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Role in hybrid ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
            Rol en la estrategia híbrida 50/20/30
          </p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          En la estrategia híbrida, el spread cubre el 20% de la exposición (4,177,560 USD) con una prima de solo{" "}
          <strong className="text-emerald-300">{PRIMA_HYB} M MXN</strong>. Aporta protección incremental sobre el
          rango de depreciación más probable (18.00–19.00) y se topa arriba de 19.00, donde el forward sigue protegiendo
          linealmente. Es la <strong className="text-white">capa de bajo costo</strong> que complementa la certidumbre
          del forward.
        </p>
      </div>

    </div>
  );
}
