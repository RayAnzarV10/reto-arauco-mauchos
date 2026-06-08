// ── Data ──────────────────────────────────────────────────────────────────────

const CHAIN = [
  { label: "Ormuz", sub: "Origen", color: "border-red-400 bg-red-50 text-red-800" },
  { label: "Petróleo & Gas", sub: "Brent ~$120/bbl pico", color: "border-orange-400 bg-orange-50 text-orange-800" },
  { label: "Metanol & NH₃", sub: "+doble dígito Asia", color: "border-amber-400 bg-amber-50 text-amber-800" },
  { label: "Urea & Melamina", sub: ">$700/t (BM)", color: "border-yellow-500 bg-yellow-50 text-yellow-800" },
  { label: "Resinas UF/MUF", sub: "Formaldehído +", color: "border-gray-400 bg-gray-50 text-gray-700" },
  { label: "MDF & Tableros", sub: "Costo en USD", color: "border-gray-400 bg-gray-100 text-gray-700" },
  { label: "USD / MXN", sub: "Presión cambiaria", color: "border-emerald-500 bg-emerald-50 text-emerald-800" },
];

const CHANNELS = [
  {
    num: "01",
    title: "Insumos",
    accent: "border-red-500",
    badge: "bg-red-500",
    highlight: "text-red-600",
    bullets: [
      "3,000 t/mes de urea · $665 USD/t · ~$1.99 M/mes",
      "1,000 t/mes de metanol · $1,486/t · ~$1.49 M/mes",
      "Ambos insumos = 50% del costo total del producto",
      "Urea puede superar $700/t si el choque persiste (BM)",
    ],
    kpi: { value: "US$3.48 M", label: "exposición mensual" },
  },
  {
    num: "02",
    title: "Logístico",
    accent: "border-amber-500",
    badge: "bg-amber-500",
    highlight: "text-amber-600",
    bullets: [
      "Brent correlacionado con bunker fuel y fletes marítimos",
      "Restricción de Ormuz: ~30% del tráfico marítimo global",
      "Rutas alternativas encarecen tiempos y costos de abasto",
      "Maquinaria y repuestos europeos sujetos a sobrecosto",
    ],
    kpi: { value: "+17.9%", label: "energía YoY (Brent)" },
  },
  {
    num: "03",
    title: "Financiero y Cambiario",
    accent: "border-blue-500",
    badge: "bg-blue-500",
    highlight: "text-blue-600",
    bullets: [
      "USD/MXN spot: 17.4563 · Forward CIP 6M: 17.7095",
      "Exposición total 6M: US$20.88 M en insumos dolarizados",
      "El escenario crítico: insumos suben + MXN se deprecia simultáneo",
      "Cobertura activa 70% · Protección máx. 26.98 M MXN",
    ],
    kpi: { value: "70%", label: "cobertura activa" },
  },
];

const RISK_MATRIX = [
  {
    name: "Mercado",
    level: "Alto",
    levelColor: "bg-red-500",
    levelText: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    risks: [
      { name: "Volatilidad USD/MXN — choque energético", impact: "Alto", prob: "Alta" },
      { name: "Depreciación simultánea + suba de insumos", impact: "Alto", prob: "Media" },
      { name: "Variación precio urea y metanol", impact: "Alto", prob: "Alta" },
      { name: "Caída del precio de celulosa BHKP", impact: "Medio", prob: "Media" },
    ],
  },
  {
    name: "Financiero",
    level: "Medio",
    levelColor: "bg-amber-500",
    levelText: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    risks: [
      { name: "CAPEX en USD (Vikingo 2.0 / Alacrán)", impact: "Alto", prob: "Media" },
      { name: "Deuda en USD con peso depreciado", impact: "Medio", prob: "Media" },
      { name: "Diferencial Banxico–Fed y carry trade", impact: "Medio", prob: "Baja" },
    ],
  },
  {
    name: "Operacional",
    level: "Medio",
    levelColor: "bg-amber-500",
    levelText: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    risks: [
      { name: "Interrupción en abasto de urea o metanol", impact: "Alto", prob: "Baja" },
      { name: "Escasez de materia prima en spot", impact: "Alto", prob: "Baja" },
      { name: "Fallas en líneas de producción MDF", impact: "Medio", prob: "Media" },
    ],
  },
  {
    name: "Regulatorio / Ambiental",
    level: "Bajo",
    levelColor: "bg-emerald-500",
    levelText: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    risks: [
      { name: "Cambios en regulación forestal mexicana", impact: "Alto", prob: "Baja" },
      { name: "Restricciones ambientales a producción MDF", impact: "Medio", prob: "Baja" },
      { name: "Riesgo reputacional ESG", impact: "Bajo", prob: "Baja" },
    ],
  },
];

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RiesgosPage() {
  const totalRisks = RISK_MATRIX.reduce((a, c) => a + c.risks.length, 0);
  const highRisks = RISK_MATRIX.filter((c) => c.level === "Alto").reduce(
    (a, c) => a + c.risks.length,
    0
  );

  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">

          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
                Gestión de riesgos · Jun 2026
              </p>
              <h2 className="mt-2 text-3xl lg:text-[2.25rem] font-bold text-white leading-tight">
                Mapa de<br />Riesgos
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                El choque energético de Medio Oriente 2026 activa tres canales
                simultáneos que presionan costos, logística y tipo de cambio.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Riesgos totales", value: totalRisks, color: "text-white" },
                { label: "Nivel alto", value: highRisks, color: "text-red-400" },
                { label: "Categorías", value: RISK_MATRIX.length, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/[0.06] border border-white/[0.08] p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-2">
              <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
              <p className="text-[11px] text-red-300 leading-relaxed">
                El riesgo más dañino: USD/MXN sube{" "}
                <strong>al mismo tiempo</strong> que se encarecen energía, urea y metanol.
                Esa correlación justifica la cobertura escalonada 50/20/30.
              </p>
            </div>
          </div>

          {/* Matriz 2×2 */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Matriz Probabilidad × Impacto
            </p>
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-[200px]">
              {[
                { label: "Alto impacto\nAlta prob.", bg: "bg-red-500/25 border-red-500/30", text: "text-red-300", dot: "bg-red-400" },
                { label: "Alto impacto\nBaja prob.", bg: "bg-amber-500/25 border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
                { label: "Bajo impacto\nAlta prob.", bg: "bg-amber-500/20 border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
                { label: "Bajo impacto\nBaja prob.", bg: "bg-emerald-500/20 border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
              ].map((cell, i) => (
                <div key={i} className={`rounded-2xl border flex flex-col items-center justify-center gap-2 p-3 ${cell.bg}`}>
                  <div className={`h-2 w-2 rounded-full ${cell.dot}`} />
                  <p className={`text-[11px] font-semibold text-center whitespace-pre-line ${cell.text}`}>
                    {cell.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>← Prob. baja</span>
              <span>Prob. alta →</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transmission chain ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Cadena de transmisión — De Ormuz al USD/MXN
          </p>
        </div>
        <div className="px-6 py-5 flex items-center gap-2 overflow-x-auto">
          {CHAIN.map((node, i) => (
            <div key={i} className="flex items-center gap-2 flex-none">
              <div className={`rounded-xl border-l-4 px-3 py-2.5 min-w-[100px] ${node.color}`}>
                <p className="text-xs font-bold leading-snug">{node.label}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{node.sub}</p>
              </div>
              {i < CHAIN.length - 1 && (
                <span className="text-gray-300 text-sm shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Three channels ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          Tres canales simultáneos de riesgo
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <div key={ch.num} className={`rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden border-t-4 ${ch.accent}`}>
              {/* Header */}
              <div className="px-5 pt-4 pb-3 flex items-center gap-3">
                <span className={`h-7 w-7 rounded-lg ${ch.badge} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {ch.num}
                </span>
                <p className={`text-sm font-bold ${ch.highlight}`}>{ch.title}</p>
                <p className={`ml-auto text-lg font-bold ${ch.highlight}`}>{ch.kpi.value}</p>
              </div>

              {/* KPI label */}
              <div className="px-5 pb-3">
                <p className="text-[10px] text-gray-400 text-right -mt-2">{ch.kpi.label}</p>
              </div>

              {/* Bullets */}
              <div className="border-t border-gray-100 px-5 py-3 space-y-1.5">
                {ch.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-2">
                    <span className={`text-[10px] mt-0.5 shrink-0 ${ch.highlight}`}>·</span>
                    <p className="text-xs text-gray-600 leading-snug">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Risk categories ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          Categorías de riesgo
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RISK_MATRIX.map((cat) => (
            <div key={cat.name} className={`rounded-2xl bg-white border ${cat.border} shadow-sm overflow-hidden`}>
              <div className={`px-5 py-3.5 ${cat.bg} flex items-center justify-between border-b ${cat.border}`}>
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cat.levelText}`}>
                  <span className={`h-2 w-2 rounded-full ${cat.levelColor}`} />
                  Nivel {cat.level}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {cat.risks.map((risk) => (
                  <div key={risk.name} className="flex items-center justify-between px-5 py-2.5 gap-3">
                    <p className="text-xs text-gray-700 flex-1 leading-snug">{risk.name}</p>
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

      {/* ── Exposure + Projects row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Exposure */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Exposición cambiaria</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Exposición mensual", value: "US$3,481,300", sub: "urea + metanol" },
              { label: "Exposición 6M total", value: "US$20,887,800", sub: "horizonte de cobertura" },
              { label: "Costo 6M en MXN", value: "≈ 364.6 M MXN", sub: "al spot 17.4563" },
              { label: "Costo implícito producto", value: "≈ US$41.78 M", sub: "insumos ÷ 50% share" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between px-5 py-3">
                <p className="text-xs text-gray-500">{m.label}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{m.value}</p>
                  <p className="text-[10px] text-gray-400">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Proyectos CAPEX expuestos</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              {
                name: "Vikingo 2.0",
                loc: "Zitácuaro, Mich.",
                capex: "≈ US$361 M",
                product: "300,000 m³/año MDF",
                sensitivity: "+$1 MXN/USD = +$361 M MXN sobrecosto",
                color: "text-amber-600",
                dot: "bg-amber-400",
              },
              {
                name: "Alacrán",
                loc: "Durango",
                capex: "≈ US$43 M",
                product: "Línea melamina e impregnación",
                sensitivity: "Menor escala, mayor sensibilidad relativa",
                color: "text-blue-600",
                dot: "bg-blue-400",
              },
            ].map((p) => (
              <div key={p.name} className="px-5 py-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${p.dot}`} />
                    <p className={`text-sm font-bold ${p.color}`}>{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.loc}</p>
                  </div>
                  <p className={`text-sm font-bold ${p.color}`}>{p.capex}</p>
                </div>
                <p className="text-xs text-gray-500 pl-4">{p.product}</p>
                <p className="text-[11px] text-gray-400 pl-4">{p.sensitivity}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
