import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";

const riskCategories = [
  {
    name: "Mercado",
    level: "Alto",
    color: "bg-red-500",
    textColor: "text-red-600",
    bgLight: "bg-red-50",
    borderColor: "border-red-100",
    risks: [
      { name: "Volatilidad tipo de cambio", impact: "Alto", prob: "Alta" },
      { name: "Caída precio celulosa", impact: "Alto", prob: "Media" },
      { name: "Variación costos energía", impact: "Medio", prob: "Alta" },
    ],
  },
  {
    name: "Financiero",
    level: "Medio",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-100",
    risks: [
      { name: "Riesgo de liquidez", impact: "Alto", prob: "Baja" },
      { name: "Exposición a deuda en USD", impact: "Medio", prob: "Media" },
      { name: "Variación tasas de interés", impact: "Medio", prob: "Media" },
    ],
  },
  {
    name: "Operacional",
    level: "Medio",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-100",
    risks: [
      { name: "Interrupción cadena de suministro", impact: "Alto", prob: "Baja" },
      { name: "Fallas en líneas de producción", impact: "Medio", prob: "Media" },
      { name: "Escasez de materia prima", impact: "Medio", prob: "Baja" },
    ],
  },
  {
    name: "Regulatorio / Ambiental",
    level: "Bajo",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-100",
    risks: [
      { name: "Cambios en regulación forestal", impact: "Alto", prob: "Baja" },
      { name: "Restricciones ambientales", impact: "Medio", prob: "Baja" },
      { name: "Riesgo reputacional ESG", impact: "Bajo", prob: "Baja" },
    ],
  },
];

const levelOrder = { Alto: 0, Medio: 1, Bajo: 2 };

const impactColor: Record<string, string> = {
  Alto: "bg-red-100 text-red-700",
  Medio: "bg-amber-100 text-amber-700",
  Bajo: "bg-emerald-100 text-emerald-700",
};

const probColor: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-amber-100 text-amber-700",
  Baja: "bg-emerald-100 text-emerald-700",
};

export default function RiesgosPage() {
  const totalRisks = riskCategories.reduce((acc, c) => acc + c.risks.length, 0);
  const highRisks = riskCategories.filter((c) => c.level === "Alto").reduce((acc, c) => acc + c.risks.length, 0);

  return (
    <ComingSoonOverlay>
    <div className="space-y-5">

      {/* Hero card */}
      <div className="rounded-3xl bg-gray-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
                Gestión de riesgos
              </p>
              <h2 className="mt-2 text-3xl lg:text-[2.25rem] font-bold text-white leading-tight">
                Mapa de<br />Riesgos
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Identificación y monitoreo de riesgos que pueden afectar la
                operación financiera y estratégica de ARAUCO.
              </p>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Riesgos totales", value: totalRisks, color: "text-white" },
                { label: "Nivel alto", value: highRisks, color: "text-red-400" },
                { label: "Categorías", value: riskCategories.length, color: "text-emerald-400" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.06] border border-white/[0.08] p-4 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: matrix 2×2 */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Matriz Probabilidad × Impacto
            </p>
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-[180px]">
              {[
                { label: "Alto impacto\nAlta prob.", bg: "bg-red-500/20 border-red-500/20", text: "text-red-300" },
                { label: "Alto impacto\nBaja prob.", bg: "bg-amber-500/20 border-amber-500/20", text: "text-amber-300" },
                { label: "Bajo impacto\nAlta prob.", bg: "bg-amber-500/20 border-amber-500/20", text: "text-amber-300" },
                { label: "Bajo impacto\nBaja prob.", bg: "bg-emerald-500/20 border-emerald-500/20", text: "text-emerald-300" },
              ].map((cell, i) => (
                <div key={i} className={`rounded-xl border flex items-center justify-center ${cell.bg}`}>
                  <p className={`text-[11px] font-medium text-center whitespace-pre-line ${cell.text}`}>
                    {cell.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>← Probabilidad baja</span>
              <span>Probabilidad alta →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {riskCategories.map((cat) => (
          <div key={cat.name} className={`rounded-2xl bg-white border ${cat.borderColor} shadow-sm overflow-hidden`}>
            <div className={`px-6 py-4 ${cat.bgLight} flex items-center justify-between border-b ${cat.borderColor}`}>
              <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cat.textColor}`}>
                <span className={`h-2 w-2 rounded-full ${cat.color}`} />
                Nivel {cat.level}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {cat.risks.map((risk) => (
                <div key={risk.name} className="flex items-center justify-between px-6 py-3 gap-3">
                  <p className="text-sm text-gray-700 flex-1">{risk.name}</p>
                  <div className="flex gap-1.5 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${impactColor[risk.impact]}`}>
                      I: {risk.impact}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${probColor[risk.prob]}`}>
                      P: {risk.prob}
                    </span>
                  </div>
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
