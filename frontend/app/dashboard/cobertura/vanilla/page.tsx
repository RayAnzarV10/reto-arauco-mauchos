import { PayoffChart } from "@/components/PayoffChart";

const K = 18.0;
const PRIMA = 5.54; // M MXN
const N = 14_621_460; // standalone 70%

// Payoff bruto: N × max(ST − K, 0)   in M MXN
const bruto = (st: number) => Math.max(0, N * (st - K)) / 1e6;
const neto = (st: number) => bruto(st) - PRIMA;

// Break-even: K + prima/N
const BREAKEVEN = K + (PRIMA * 1e6) / N; // 18.3789

const BRUTO_SERIES = {
  label: "Payoff bruto call",
  color: "#7c3aed", // violet-700
  strokeWidth: 2,
  points: [16, 18, BREAKEVEN, 19, 20].map((x) => ({ x, y: bruto(x) })),
};

const NETO_SERIES = {
  label: "P&L neto (tras prima)",
  color: "#d97706", // amber-600
  strokeWidth: 2,
  dashed: false,
  points: [16, 18, BREAKEVEN, 19, 20].map((x) => ({ x, y: neto(x) })),
};

const scenarios = [
  { st: 16.5, label: "Peso fuerte" },
  { st: 17.5, label: "Nivel spot" },
  { st: 18.0, label: "Strike K=18" },
  { st: 18.5, label: "Depreciación leve" },
  { st: 19.0, label: "Depreciación moderada" },
  { st: 20.0, label: "Depreciación fuerte" },
];

export default function VanillaPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">

          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-500 uppercase">
                  Instrumento 2 · Referencia comparativa
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  Protección asimétrica
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Opción Vanilla<br />Long USD/MXN Call
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Derecho (no obligación) a comprar dólares a $18.00 MXN/USD.
                Protección asimétrica: el beneficio de un peso fuerte se conserva,
                pero la prima es la más alta entre las alternativas.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-5 py-4">
              <p className="text-[10px] text-gray-500 mb-2 tracking-widest uppercase">Modelo Garman-Kohlhagen</p>
              <p className="font-mono text-sm text-purple-300">
                Payoff = N × MAX(S<sub>T</sub> − K, 0)
              </p>
              <p className="font-mono text-sm text-white mt-1.5">
                P&L neto = Payoff − Prima
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-gray-500">
                <span>K = {K.toFixed(2)}</span>
                <span>σ = 10.4%</span>
                <span>T = 0.5 años</span>
                <span>N = $14.62 M USD</span>
                <span>Prima = {PRIMA} M MXN</span>
                <span>B/E = {BREAKEVEN.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Parámetros del instrumento
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Strike K", value: K.toFixed(2), unit: "USD/MXN" },
                { label: "Prima standalone", value: `${PRIMA} M`, unit: "MXN · el más alto" },
                { label: "Break-even", value: BREAKEVEN.toFixed(4), unit: "USD/MXN" },
                { label: "Payoff máximo", value: "Ilimitado", unit: "crece con ST" },
                { label: "Participa si MXN↑", value: "Sí", unit: "opción expira sin valor" },
                { label: "Vs prima híbrida", value: "5× más caro", unit: "vs 1.09 M MXN" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3">
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                  <p className="text-base font-bold text-white mt-0.5">{m.value}</p>
                  <p className="text-[10px] text-gray-600">{m.unit}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-3 flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">ℹ</span>
              <p className="text-[11px] text-purple-300 leading-relaxed">
                La opción vanilla ofrece <strong>protección asimétrica ideal</strong> pero a la prima más alta.
                Por eso en la estrategia híbrida se reemplaza por un bull call spread de menor costo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Payoff bruto y P&amp;L neto — Opción vanilla call (M MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Piso de pérdida = prima ({PRIMA} M MXN) antes de K = {K.toFixed(2)}.
            Pendiente creciente por encima del strike. Break-even en {BREAKEVEN.toFixed(4)}.
          </p>
        </div>
        <div className="px-4 py-4">
          <PayoffChart
            id="vanilla-chart"
            series={[BRUTO_SERIES, NETO_SERIES]}
            xDomain={[16, 20]}
            yDomain={[-8, 32]}
            xTicks={[16, 17, 18, 19, 20]}
            yTicks={[-5, 0, 5, 10, 15, 20, 25, 30]}
            refLines={[{ x: K, label: `K=${K}` }, { x: BREAKEVEN, label: `B/E=${BREAKEVEN.toFixed(2)}` }]}
            height={230}
          />
        </div>
      </div>

      {/* ── Scenario grid ── */}
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
              <div key={s.st} className={`rounded-2xl border p-4 flex flex-col gap-1 ${isPos ? "bg-purple-50 border-purple-100" : "bg-gray-50 border-gray-100"}`}>
                <p className={`text-[10px] font-semibold ${isPos ? "text-purple-600" : "text-gray-500"}`}>
                  {s.st.toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">{s.label}</p>
                <div className="mt-1">
                  <p className="text-[10px] text-gray-400">Bruto</p>
                  <p className="text-sm font-bold text-gray-700">+{b.toFixed(1)} M</p>
                  <p className="text-[10px] text-gray-400 mt-1">Neto</p>
                  <p className={`text-sm font-bold ${isPos ? "text-purple-700" : "text-red-600"}`}>
                    {n >= 0 ? "+" : ""}{n.toFixed(1)} M
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Comparison vs Forward ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">Ventajas vs Forward</p>
          <ul className="space-y-2">
            {[
              "Protección asimétrica: conserva beneficio de apreciación del peso",
              "Payoff potencial ilimitado al alza (mayor que forward)",
              "Obligación unilateral — sólo ARAUCO decide si ejercer",
              "Ideal si hay alta incertidumbre sobre dirección del tipo de cambio",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{v}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-3">Desventajas vs Estrategia híbrida</p>
          <ul className="space-y-2">
            {[
              `Prima de ${PRIMA} M MXN — 5× mayor que la prima híbrida (1.09 M MXN)`,
              "Break-even elevado: MXN debe depreciarse a 18.38 para cubrir el costo",
              "No se incluye en la recomendación: prima superior no justificada vs BCS",
              "Costo upfront afecta el flujo de caja desde el inicio de la cobertura",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-400 shrink-0 mt-0.5">✗</span>{v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Context note ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-purple-400" />
          <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
            Por qué no se recomienda standalone
          </p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          La opción vanilla ofrece el perfil de protección más atractivo, pero a la prima más alta. La estrategia híbrida
          reemplaza la vanilla por un <strong className="text-purple-300">bull call spread</strong> que entrega la misma
          protección dentro del rango relevante (18.00–19.00) a un costo de prima notablemente menor (3.81 M vs 5.54 M standalone,
          o 1.09 M vs 5.54 M en la capa de la híbrida).
        </p>
      </div>

    </div>
  );
}
