import Link from "next/link";
import { PayoffChart } from "@/components/PayoffChart";

// ── Data from the model ───────────────────────────────────────────────────────
const SPOT = 17.4563;
const FORWARD = 17.7095;
const EXPO_6M = 20_887_800;
const NOTIONAL_COV = 14_621_460;
const PRIMA_HIBRIDA = 1.09; // M MXN
const PRIMA_VANILLA = 5.54; // M MXN

// P&L table (M MXN, from model)
const PNL = [
  { st: 16.50, sinCob: 19.975, forward: 2.291, vanilla: 14.258, spread: 16.040, sintetico: 2.291, hibrida: 6.219 },
  { st: 17.50, sinCob: -0.913, forward: -3.976, vanilla: -6.630, spread: -4.847, sintetico: -3.976, hibrida: -4.225 },
  { st: 18.00, sinCob: -11.357, forward: -7.109, vanilla: -17.074, spread: -15.291, sintetico: -7.109, hibrida: -9.447 },
  { st: 19.00, sinCob: -32.244, forward: -13.375, vanilla: -23.340, spread: -21.558, sintetico: -13.375, hibrida: -15.713 },
  { st: 20.00, sinCob: -53.132, forward: -19.642, vanilla: -29.606, spread: -42.446, sintetico: -19.642, hibrida: -26.157 },
];

// Protection chart series
const SIN_COB_SERIES = {
  label: "Sin cobertura",
  color: "#ef4444",
  strokeWidth: 2,
  points: PNL.map((r) => ({ x: r.st, y: r.sinCob })),
};
const HIBRIDA_SERIES = {
  label: "Estrategia híbrida",
  color: "#059669",
  strokeWidth: 2.5,
  points: PNL.map((r) => ({ x: r.st, y: r.hibrida })),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtM(v: number) {
  if (v === 0) return "—";
  const abs = Math.abs(v);
  const str = abs.toFixed(1) + " M";
  return v < 0 ? `(${str})` : str;
}

function cellColor(v: number) {
  if (v > 0) return "text-emerald-600 font-semibold";
  if (v < -20) return "text-red-600 font-semibold";
  if (v < -10) return "text-red-500";
  return "text-gray-700";
}

const INSTRUMENTS = [
  { label: "Forward OTC", href: "/dashboard/cobertura/forward", tag: "Certidumbre máxima", color: "bg-blue-50 text-blue-700 border-blue-100", desc: "Fija el tipo de cambio hoy. Sin prima. Sin beneficio si el MXN se aprecia." },
  { label: "Opción Vanilla", href: "/dashboard/cobertura/vanilla", tag: "Protección asimétrica", color: "bg-purple-50 text-purple-700 border-purple-100", desc: "Protege ante depreciación, conserva beneficio de apreciación. Prima más alta." },
  { label: "Bull Call Spread", href: "/dashboard/cobertura/bull-call-spread", tag: "Protección eficiente", color: "bg-amber-50 text-amber-700 border-amber-100", desc: "Prima reducida. Protección entre K₁=18.00 y K₂=19.00. Topada arriba de K₂." },
  { label: "Sintético", href: "/dashboard/cobertura/sintetico", tag: "Validación técnica", color: "bg-gray-50 text-gray-600 border-gray-100", desc: "Call + put vendida replica el forward. Confirma consistencia por paridad put-call." },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CoberturaPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">

          {/* Left */}
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
                Gestión financiera · Derivados OTC
              </p>
              <h2 className="mt-2 text-3xl lg:text-[2.25rem] font-bold text-white leading-tight">
                Estrategia<br />Híbrida 50/20/30
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Forward, bull call spread y exposición abierta sobre
                20,887,800 USD de exposición a seis meses en USD/MXN.
              </p>
            </div>

            {/* Key KPIs */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Spot USD/MXN", value: SPOT.toFixed(4) },
                { label: "Forward CIP 6M", value: FORWARD.toFixed(4) },
                { label: "Exposición 6M", value: "20.89 M USD" },
                { label: "Prima híbrida", value: `${PRIMA_HIBRIDA} M MXN` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3">
                  <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-base font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: strategy layers */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-5">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Capas de la estrategia
            </p>

            {[
              {
                pct: 50, label: "Forward OTC", notional: "10,443,900 USD",
                fn: "Fija el flujo más probable", color: "bg-blue-400",
              },
              {
                pct: 20, label: "Bull Call Spread", notional: "4,177,560 USD",
                fn: "Protege depreciación moderada (K₁=18 / K₂=19)", color: "bg-emerald-400",
              },
              {
                pct: 30, label: "Abierto", notional: "6,266,340 USD",
                fn: "Conserva beneficio si el peso se aprecia", color: "bg-gray-600",
              },
            ].map((layer) => (
              <div key={layer.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{layer.label}</p>
                    <p className="text-[11px] text-gray-500">{layer.fn}</p>
                  </div>
                  <span className="text-lg font-bold text-white">{layer.pct}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${layer.color}`} style={{ width: `${layer.pct}%` }} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-600">{layer.notional}</p>
              </div>
            ))}

            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 mt-1">
              <p className="text-[10px] text-gray-500">Cobertura efectiva (fwd + spread)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-white">70%</p>
                <p className="text-[11px] text-gray-500">del notional · prima total {PRIMA_HIBRIDA} M MXN <span className="text-gray-600">(0.43%)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lectura ejecutiva ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
            Tesis de la recomendación
          </p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          La capa forward estabiliza el flujo más probable; el bull call spread protege el rango de
          depreciación relevante con prima menor que una opción vanilla; y la porción abierta conserva
          exposición favorable ante un peso fuerte.
        </p>
        <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
          <span className="mt-px shrink-0">⚠</span>
          <span>
            Frente a una depreciación a 20.00 USD/MXN, la estructura reduce la pérdida en{" "}
            <span className="text-white font-semibold">26.98 millones MXN</span> vs no cubrirse.
            Prima total: 0.43% del notional cubierto — vs 5.54 M MXN de una cobertura vanilla equivalente.
          </span>
        </p>
      </div>

      {/* ── Protection chart ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            P&amp;L total · Estrategia híbrida vs. sin cobertura (MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Área sombreada = protección acumulada. En 20.00 la protección alcanza ≈ 26.98 M MXN.
          </p>
        </div>
        <div className="px-4 py-4">
          <PayoffChart
            id="prot-chart"
            series={[SIN_COB_SERIES, HIBRIDA_SERIES]}
            xDomain={[16, 20.5]}
            yDomain={[-60, 25]}
            xTicks={[16, 16.5, 17, 17.5, 18, 19, 20]}
            yTicks={[-50, -40, -30, -20, -10, 0, 10, 20]}
            refLines={[{ x: FORWARD, label: `F=${FORWARD}` }]}
            height={240}
          />
        </div>
      </div>

      {/* ── P&L table ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            P&amp;L total por estrategia y escenario (M MXN)
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Valores entre paréntesis representan deterioro vs. presupuesto base. Notional cubierto = 70% de la exposición.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {["ST USD/MXN", "Sin cobertura", "Forward", "Opción Vanilla", "Bull Call Spread", "Sintético", "Híbrida"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-left font-semibold tracking-wider uppercase text-[10px] ${i === 6 ? "text-emerald-600 bg-emerald-50" : "text-gray-400"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PNL.map((row) => (
                <tr key={row.st} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{row.st.toFixed(2)}</td>
                  <td className={`px-4 py-3 ${cellColor(row.sinCob)}`}>{fmtM(row.sinCob)}</td>
                  <td className={`px-4 py-3 ${cellColor(row.forward)}`}>{fmtM(row.forward)}</td>
                  <td className={`px-4 py-3 ${cellColor(row.vanilla)}`}>{fmtM(row.vanilla)}</td>
                  <td className={`px-4 py-3 ${cellColor(row.spread)}`}>{fmtM(row.spread)}</td>
                  <td className={`px-4 py-3 ${cellColor(row.sintetico)}`}>{fmtM(row.sintetico)}</td>
                  <td className={`px-4 py-3 bg-emerald-50 ${cellColor(row.hibrida)}`}>{fmtM(row.hibrida)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Protection summary cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { scenario: "Depreciación fuerte (20.00)", saving: "26.98 M MXN", color: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", note: "Reducción de pérdida vs. sin cobertura" },
          { scenario: "Depreciación moderada (19.00)", saving: "16.53 M MXN", color: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", note: "Ahorro acumulado con cobertura del 70%" },
          { scenario: "Umbral de protección (18.00)", saving: "1.91 M MXN", color: "bg-amber-50 border-amber-100", text: "text-amber-700", note: "A partir de aquí la cobertura genera valor neto positivo" },
        ].map((c) => (
          <div key={c.scenario} className={`rounded-2xl ${c.color} border p-5 flex flex-col gap-2`}>
            <p className={`text-[10px] font-semibold tracking-wider uppercase ${c.text}`}>{c.scenario}</p>
            <p className={`text-2xl font-bold ${c.text}`}>{c.saving}</p>
            <p className="text-[11px] text-gray-500">{c.note}</p>
          </div>
        ))}
      </div>

      {/* ── Navigate to individual instruments ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          Análisis por instrumento
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSTRUMENTS.map((inst) => (
            <Link key={inst.href} href={inst.href}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-900">{inst.label}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${inst.color}`}>
                    {inst.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{inst.desc}</p>
              </div>
              <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-lg mt-0.5">→</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
