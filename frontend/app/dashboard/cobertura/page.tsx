import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";

const strategies = [
  {
    name: "Cobertura Cambiaria",
    instrument: "Forwards USD/CLP",
    coverage: 65,
    horizon: "12 meses",
    status: "Activa",
    statusColor: "bg-emerald-100 text-emerald-700",
    description: "Protección ante depreciación del peso chileno en exportaciones de celulosa.",
    metrics: [
      { label: "Exposición bruta", value: "—", unit: "MUSD" },
      { label: "Monto cubierto", value: "—", unit: "MUSD" },
      { label: "Tipo de cambio forward", value: "—", unit: "CLP/USD" },
    ],
  },
  {
    name: "Cobertura de Tasas",
    instrument: "Interest Rate Swap",
    coverage: 50,
    horizon: "5 años",
    status: "Activa",
    statusColor: "bg-emerald-100 text-emerald-700",
    description: "Conversión de deuda a tasa variable hacia tasa fija para reducir volatilidad financiera.",
    metrics: [
      { label: "Deuda total", value: "—", unit: "MUSD" },
      { label: "Monto en IRS", value: "—", unit: "MUSD" },
      { label: "Tasa fija pactada", value: "—", unit: "%" },
    ],
  },
  {
    name: "Cobertura de Commodities",
    instrument: "Contratos a futuro",
    coverage: 30,
    horizon: "6 meses",
    status: "En evaluación",
    statusColor: "bg-amber-100 text-amber-700",
    description: "Aseguramiento parcial del precio de venta de celulosa para reducir exposición al mercado spot.",
    metrics: [
      { label: "Volumen spot", value: "—", unit: "ton" },
      { label: "Volumen cubierto", value: "—", unit: "ton" },
      { label: "Precio de ejercicio", value: "—", unit: "USD/ton" },
    ],
  },
];

function CoverageBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-900 w-10 text-right">{value}%</span>
    </div>
  );
}

export default function CoberturaPage() {
  const avgCoverage = Math.round(
    strategies.reduce((acc, s) => acc + s.coverage, 0) / strategies.length
  );

  return (
    <ComingSoonOverlay>
    <div className="space-y-5">

      {/* Hero card */}
      <div className="rounded-3xl bg-gray-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
                Gestión financiera
              </p>
              <h2 className="mt-2 text-3xl lg:text-[2.25rem] font-bold text-white leading-tight">
                Estrategia de<br />Cobertura
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Instrumentos activos para mitigar la exposición a riesgos de
                mercado: cambiario, tasas de interés y commodities.
              </p>
            </div>

            {/* Global coverage indicator */}
            <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5">
              <p className="text-[11px] font-medium text-gray-500 mb-3">Cobertura global promedio</p>
              <p className="text-4xl font-bold text-white mb-3">{avgCoverage}%</p>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                  style={{ width: `${avgCoverage}%` }}
                />
              </div>
            </div>

            {/* Strategy count */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Estrategias", value: strategies.length },
                { label: "Activas", value: strategies.filter(s => s.status === "Activa").length },
                { label: "En evaluación", value: strategies.filter(s => s.status !== "Activa").length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3 text-center">
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: coverage breakdown */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-5">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Porcentaje de cobertura por estrategia
            </p>
            <div className="flex flex-col gap-5 justify-center flex-1">
              {strategies.map((s) => (
                <div key={s.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 -mt-1">{s.instrument} · {s.horizon}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${s.coverage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-10 text-right">{s.coverage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategy detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {strategies.map((s) => (
          <div key={s.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-bold text-gray-900 leading-snug">{s.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.statusColor}`}>
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">{s.instrument} · {s.horizon}</p>
            </div>

            <div className="px-6 py-4 flex flex-col gap-3 flex-1">
              <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>

              <div className="mt-auto flex flex-col gap-1">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
                  Cobertura
                </p>
                <CoverageBar value={s.coverage} />
              </div>
            </div>

            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {s.metrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between px-6 py-2.5">
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {m.value} <span className="font-normal text-gray-400">{m.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
    </ComingSoonOverlay>
  );
}
