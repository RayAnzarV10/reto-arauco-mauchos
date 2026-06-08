import { PayoffChart } from "@/components/PayoffChart";

// ── Model constants ───────────────────────────────────────────────────────────
const S0 = 17.4563;
const F = 17.7095;
const N = 14_621_460; // 70% standalone notional (USD)
const N_HYB = 10_443_900; // 50% in hybrid strategy

// Forward payoff = N × (ST − F)  in M MXN
function fwdPayoff(st: number, n = N) {
  return (n * (st - F)) / 1e6;
}

const FORWARD_SERIES = {
  label: "Payoff forward",
  color: "#3b82f6", // blue-500
  points: [16.0, 16.5, 17.0, 17.5, F, 18.0, 18.5, 19.0, 19.5, 20.0].map(
    (x) => ({ x, y: fwdPayoff(x) })
  ),
};

const scenarios = [
  { label: "Peso fuerte (16.50)", st: 16.5, icon: "▲", dir: "favorable" },
  { label: "Nivel spot (17.46)", st: 17.46, icon: "•", dir: "neutral" },
  { label: "Nivel forward (17.71)", st: 17.71, icon: "•", dir: "neutral" },
  { label: "Depreciación leve (18.00)", st: 18.0, icon: "▼", dir: "risk" },
  { label: "Depreciación fuerte (20.00)", st: 20.0, icon: "▼▼", dir: "danger" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ForwardPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">

          {/* Left */}
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-500 uppercase">
                  Instrumento 1 · 50% de la exposición
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  Certidumbre máxima
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Forward OTC<br />USD/MXN
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Fija hoy el tipo de cambio al que ARAUCO comprará dólares en
                seis meses. Sin costo inicial. Sin posibilidad de beneficiarse
                de una apreciación del peso sobre la porción cubierta.
              </p>
            </div>

            {/* Formula */}
            <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-5 py-4">
              <p className="text-[10px] text-gray-500 mb-2 tracking-widest uppercase">Valuación (Paridad cubierta de tasas)</p>
              <p className="font-mono text-sm text-emerald-300">
                F = S₀ × exp((r<sub>MXN</sub> − r<sub>USD</sub>) × T)
              </p>
              <p className="font-mono text-sm text-white mt-1.5">
                Payoff = N × (S<sub>T</sub> − F)
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-gray-500">
                <span>S₀ = {S0}</span>
                <span>r<sub>MXN</sub> = 6.50%</span>
                <span>r<sub>USD</sub> = 3.62%</span>
                <span>T = 0.5 años</span>
                <span>F = {F}</span>
                <span>N = $14.62 M USD</span>
              </div>
            </div>
          </div>

          {/* Right: metrics */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-5">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Parámetros del instrumento
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Forward CIP 6M", value: F.toFixed(4), unit: "USD/MXN" },
                { label: "Prima inicial", value: "n/a", unit: "Sin costo" },
                { label: "Notional standalone", value: "14,621,460", unit: "USD (70%)" },
                { label: "Notional en híbrida", value: "10,443,900", unit: "USD (50%)" },
                { label: "Participa si MXN↓", value: "Sí", unit: "cobertura total" },
                { label: "Participa si MXN↑", value: "No", unit: "costo de oport." },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3">
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                  <p className="text-base font-bold text-white mt-0.5">{m.value}</p>
                  <p className="text-[10px] text-gray-600">{m.unit}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ</span>
              <p className="text-[11px] text-blue-300 leading-relaxed">
                El forward es el instrumento de <strong>mayor certidumbre y menor flexibilidad</strong>.
                Neutraliza tanto el riesgo como el beneficio sobre la porción cubierta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payoff chart ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Perfil de payoff — Forward OTC (M MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Línea diagonal creciente. Cruza cero en F = {F}. Por encima: compensa el encarecimiento del dólar. Por debajo: costo de oportunidad.
          </p>
        </div>
        <div className="px-4 py-4">
          <PayoffChart
            id="fwd-chart"
            series={[FORWARD_SERIES]}
            xDomain={[16, 20]}
            yDomain={[-30, 40]}
            xTicks={[16, 17, 18, 19, 20]}
            yTicks={[-25, -15, -5, 0, 10, 20, 30]}
            refLines={[{ x: F, label: `F=${F}` }]}
            height={220}
          />
        </div>
      </div>

      {/* ── Scenarios ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          Resultado por escenario (standalone, N = 14,621,460 USD)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {scenarios.map((s) => {
            const payoff = fwdPayoff(s.st);
            const isPos = payoff >= 0;
            return (
              <div key={s.label} className={`rounded-2xl border p-4 flex flex-col gap-1 ${isPos ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}>
                <p className={`text-[10px] font-semibold tracking-wider uppercase ${isPos ? "text-blue-600" : "text-red-600"}`}>
                  {s.icon} {s.st.toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">{s.label}</p>
                <p className={`text-lg font-bold ${isPos ? "text-blue-700" : "text-red-700"}`}>
                  {payoff >= 0 ? "+" : ""}{payoff.toFixed(1)} M
                </p>
                <p className="text-[10px] text-gray-400">MXN payoff</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pros / Cons ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">Ventajas</p>
          <ul className="space-y-2">
            {[
              "Certidumbre presupuestal completa sobre la porción cubierta",
              "Sin costo de prima inicial (flujo de caja)",
              "Instrumento OTC — flexible en monto y plazo",
              "Precio determinístico: F = 17.7095 USD/MXN independiente de la volatilidad",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-3">Limitaciones</p>
          <ul className="space-y-2">
            {[
              "Elimina el beneficio de una apreciación del MXN sobre el 50% cubierto",
              "Obligación bilateral — no hay salida sencilla antes del vencimiento",
              "Costo de oportunidad puede ser significativo si el MXN se aprecia fuertemente",
              "No protege el 30% de exposición abierta (por diseño de la estrategia híbrida)",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Role in hybrid ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
            Rol en la estrategia híbrida 50/20/30
          </p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          El forward cubre el 50% de la exposición (10,443,900 USD) y domina la pendiente total del payoff híbrido.
          Es la capa de <strong className="text-blue-300">certidumbre base</strong>: protege el componente de flujo más predecible
          y fija el presupuesto de esa porción. El 20% en bull call spread y el 30% abierto se calibran alrededor de este ancla.
        </p>
      </div>

    </div>
  );
}
