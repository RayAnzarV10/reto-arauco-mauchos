import { api, MacroItem } from "@/lib/api";
import { MacroTooltip } from "@/components/MacroTooltip";

// ── Tooltip copy ──────────────────────────────────────────────────────────────
const TOOLTIPS: Record<string, string> = {
  "USD / MXN":
    "Principal exposición cambiaria de Arauco México. Cada +$0.10 MXN/USD encarece el CAPEX no cubierto en ~$28M MXN.",
  "USD / CLP":
    "Exposición consolidada del grupo. Afecta la conversión de resultados de la subsidiaria mexicana al holding chileno.",
  "EUR / USD":
    "Relevante para maquinaria y repuestos europeos de las líneas de producción. Un euro fuerte encarece mantenimiento.",
  Urea:
    "Insumo petroquímico para resinas urea-formaldehído usadas en MDF y aglomerado. Precio histórico de compra según nota del socio formador (Entregable Final Jun 2026). ARAUCO México compra ~3,000 t/mes.",
  Metanol:
    "Insumo para resinas melamínicas y adhesivos. Precio histórico de compra según nota del socio formador (Entregable Final Jun 2026). ARAUCO México compra ~1,000 t/mes.",
  "Petróleo Brent":
    "Driver de costos logísticos (fletes marítimos, transporte terrestre) y de insumos petroquímicos. Nivel actual: +17.9% YoY vs base ~$72/bbl pre-choque. Pico del episodio de Medio Oriente 2026: ~$120/bbl.",
  "Tasa Banxico":
    "Política monetaria mexicana. Diferencial con Fed (~287.5 pb) sostiene al peso vía carry trade. Ciclo de recortes cerrado en mayo 2026.",
  "Tasa Fed":
    "Política monetaria EE.UU. FOMC dividido por choque energético. Recortes adicionales debilitarían el diferencial y al peso.",
  "Inflación México (IPC)":
    "Por encima del techo de Banxico (3% ±1%). Erosiona poder adquisitivo y demanda final de MDF y melamina en segmento residencial.",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function ChangeTag({ change }: { change: number | null }) {
  if (change === null) return null;
  const up = change >= 0;
  return (
    <span className={`text-[11px] font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
    </span>
  );
}

function fmt(item: MacroItem) {
  return (
    item.display ??
    (item.value !== null
      ? item.value.toLocaleString("es-MX", { maximumFractionDigits: 4 })
      : "—")
  );
}

function MacroRow({ item }: { item: MacroItem }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-700">{item.label}</p>
          <p className="text-xs text-gray-400">{item.unit}</p>
        </div>
        {TOOLTIPS[item.label] && (
          <MacroTooltip text={TOOLTIPS[item.label]} dark />
        )}
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">{fmt(item)}</p>
        <ChangeTag change={item.change} />
      </div>
    </div>
  );
}

// ── Impact cards data ─────────────────────────────────────────────────────────
const IMPACT_CARDS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" />
        <path d="m7 17 10-10M17 9V7m0 0h-2" />
      </svg>
    ),
    label: "CAMBIARIO",
    title: "Cambiario",
    text: "Exposición CAPEX de US$282.8M no cubierto en Vikingo 2.0 y Alacrán. Sensibilidad: cada +$1 MXN/USD equivale a +$282.8M MXN de sobrecosto antes de coberturas.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    label: "OPERATIVO",
    title: "Operativo",
    text: "Costos de insumos dolarizados (resinas, adhesivos, repuestos europeos) y presión sobre urea/metanol vía choque energético global. Riesgo de compresión de márgenes.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    label: "ESTRATÉGICO",
    title: "Estratégico",
    text: "Decisión sobre timing de desembolsos Vikingo 2.0 y Alacrán. Ventana actual: 6-12 meses favorables para contratar coberturas escalonadas (forwards y opciones) sobre tramos próximos.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function VariablesPage() {
  const groups = await api.getMacro();
  const now = new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });

  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">

          {/* Hero izquierdo */}
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
                Contexto económico
              </p>
              <h2 className="mt-2 text-3xl lg:text-[2.25rem] font-bold text-white leading-tight">
                Variables<br />Macroeconómicas
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Monitoreo de indicadores externos que impactan la operación y
                rentabilidad de ARAUCO México a nivel local y global.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Tipo de cambio USD/MXN", note: "Principal exposición cambiaria (CAPEX US$404M)" },
                { label: "Precio Urea / Metanol", note: "Insumos petroquímicos clave para resinas y adhesivos" },
                { label: "Diferencial Banxico vs. Fed", note: "Soporte del peso vía carry trade (~287.5 pb)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-gray-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero derecho: divisas en vivo */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Tipos de cambio · Jun 2026
            </p>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {groups
                .find((g) => g.category === "Divisas")
                ?.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.07] px-5 py-4">
                    <div className="flex items-center">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      {TOOLTIPS[item.label] && (
                        <MacroTooltip text={TOOLTIPS[item.label]} />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{fmt(item)}</p>
                      <ChangeTag change={item.change} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Capa 2: Banner "Lectura del Día" ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Lectura del día
            </p>
          </div>
          <p className="text-[11px] text-gray-600">Actualizado: {now}</p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          Peso fuerte (USD/MXN ~17.31) + Banxico en pausa configuran una ventana favorable
          de 6-12 meses para escalonar coberturas del CAPEX comprometido en Vikingo 2.0 y Alacrán.
        </p>
        <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
          <span className="mt-px shrink-0">⚠</span>
          <span>
            El choque energético en Medio Oriente podría revertir el escenario en un horizonte de 2-6 meses.
          </span>
        </p>
      </div>

      {/* ── Capa 0: Tarjetas de datos ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {groups.map((group) => (
          <div key={group.category} className="rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-3 border-b border-gray-100">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                {group.category}
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {group.items.map((item) => (
                <MacroRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Capa 3: ¿Cómo afecta a Arauco? ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3 px-1">
          ¿Cómo afecta a Arauco?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {IMPACT_CARDS.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                <span className="text-gray-400">{card.icon}</span>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  {card.label}
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
