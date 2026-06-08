"use client";

import { useState } from "react";

const ARGS = [
  {
    num: "1",
    title: "Carry trade activo",
    body: "El diferencial Banxico-Fed es ~287.5 pb (6.50% vs 3.50–3.75%). Ese spread sostiene flujos de carry que generan demanda de pesos y sesgo apreciativo sobre el MXN en el horizonte de 6M.",
    accent: "border-emerald-500/30 bg-emerald-500/10",
    numColor: "bg-emerald-500/20 text-emerald-300",
  },
  {
    num: "2",
    title: "Costo de oportunidad del 100%",
    body: "El forward CIP a 6M fija el tipo en 17.7095. Si el peso se aprecia a ~16.80 (escenario carry), cubrir ese 30% adicional sacrifica ~$2.5 M MXN de beneficio esperado sin agregar riesgo de pérdida.",
    accent: "border-blue-500/30 bg-blue-500/10",
    numColor: "bg-blue-500/20 text-blue-300",
  },
  {
    num: "3",
    title: "Colchón de liquidez operativa",
    body: "La porción abierta permite liquidar insumos a precio spot si el MXN se aprecia, sin incurrir en costos de terminación anticipada del forward ni en margen adicional de la contraparte.",
    accent: "border-gray-500/30 bg-gray-500/10",
    numColor: "bg-gray-500/20 text-gray-300",
  },
];

export function OpenLayerInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-white transition-colors group"
      >
        <span className="h-4 w-4 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-[9px] text-gray-400 group-hover:border-white/30 transition-colors">
          ℹ
        </span>
        ¿Por qué 30% abierto?
        <span className="text-gray-600 transition-transform duration-200" style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.06]">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
              Justificación técnica · 3 argumentos
            </p>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {ARGS.map((arg) => (
              <div key={arg.num} className={`px-4 py-3 flex items-start gap-3 ${arg.accent}`}>
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${arg.numColor}`}>
                  {arg.num}
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-white mb-0.5">{arg.title}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{arg.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
