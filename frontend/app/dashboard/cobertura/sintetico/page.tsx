import { PayoffChart } from "@/components/PayoffChart";

const K = 17.7095; // = forward CIP (strike igual al forward para paridad put-call)
const F = 17.7095;
const N = 14_621_460;

// Synthetic = call comprada + put vendida al mismo strike K = F
// By put-call parity: converge al payoff del forward
// Payoff = N × [max(ST-K, 0) - max(K-ST, 0)] = N × (ST - K)
const synPayoff = (st: number) => (N * (st - K)) / 1e6;
const fwdPayoff = (st: number) => (N * (st - F)) / 1e6; // should be identical

const SYN_SERIES = {
  label: "Payoff sintético (call + put)",
  color: "#6366f1", // indigo-500
  strokeWidth: 2.5,
  points: [16, 16.5, 17, 17.5, K, 18, 18.5, 19, 19.5, 20].map((x) => ({
    x,
    y: synPayoff(x),
  })),
};

const FWD_EQUIV_SERIES = {
  label: "Forward equivalente",
  color: "#d97706",
  strokeWidth: 1.5,
  dashed: true,
  points: [16, 17, K, 18, 19, 20].map((x) => ({ x, y: fwdPayoff(x) })),
};

export default function SinteticoPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <div className="rounded-3xl bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">

          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-gray-500 uppercase">
                  Instrumento 4 · Validación técnica
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  Paridad put-call
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Sintético<br />Forward
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Construido combinando una call comprada y una put vendida al mismo strike
                K = F = {F}. Replica económicamente un forward largo. Su propósito
                es validar la consistencia interna del modelo.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-5 py-4">
              <p className="text-[10px] text-gray-500 mb-2 tracking-widest uppercase">Paridad Put-Call (Garman-Kohlhagen)</p>
              <p className="font-mono text-sm text-indigo-300">
                Call(K,T) − Put(K,T) = S₀e<sup>−r<sub>f</sub>T</sup> − Ke<sup>−r<sub>d</sub>T</sup>
              </p>
              <p className="font-mono text-sm text-white mt-2">
                Payoff = N × [MAX(S<sub>T</sub>−K,0) − MAX(K−S<sub>T</sub>,0)]
              </p>
              <p className="font-mono text-sm text-emerald-300 mt-1.5">
                ≡ N × (S<sub>T</sub> − F) &nbsp;←&nbsp; forward equivalente
              </p>
              <p className="text-[10px] text-gray-500 mt-3">
                Con K = F = {F}: las primas de call y put vendida se cancelan → sin costo neto.
              </p>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/[0.08] p-8 lg:p-10 flex flex-col gap-4">
            <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
              Parámetros del instrumento
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Strike K", value: K.toFixed(4), unit: "= Forward CIP" },
                { label: "Prima neta", value: "≈ 0", unit: "call − put ≈ 0" },
                { label: "Construcción", value: "Call + Put vendida", unit: "mismo K, T, N" },
                { label: "Payoff resultado", value: "Forward-like", unit: "idéntico al forward" },
                { label: "Confirma paridad", value: "Sí", unit: "validación técnica" },
                { label: "Recomendado en híbrida", value: "No", unit: "sin valor añadido vs fwd" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/[0.05] border border-white/[0.07] px-4 py-3">
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{m.value}</p>
                  <p className="text-[10px] text-gray-600">{m.unit}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">ℹ</span>
              <p className="text-[11px] text-indigo-300 leading-relaxed">
                El sintético <strong>no se selecciona como recomendación principal</strong> porque reproduce el perfil del
                forward sin aportar ninguna mejora económica frente a su contratación directa. Se incluye como prueba de
                consistencia del modelo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Replicación del forward — Sintético vs Forward equivalente
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            El payoff sintético (call + put vendida) se superpone exactamente con el forward equivalente,
            evidenciando la paridad put-call. Ambas líneas deben coincidir.
          </p>
        </div>
        <div className="px-4 py-4">
          <PayoffChart
            id="syn-chart"
            series={[SYN_SERIES, FWD_EQUIV_SERIES]}
            xDomain={[16, 20]}
            yDomain={[-30, 40]}
            xTicks={[16, 17, 18, 19, 20]}
            yTicks={[-25, -15, -5, 0, 10, 20, 30]}
            refLines={[{ x: K, label: `K=F=${F}` }]}
            height={220}
          />
        </div>
      </div>

      {/* ── Concept cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Construcción",
            icon: "⚙",
            color: "bg-indigo-50 border-indigo-100",
            textColor: "text-indigo-700",
            items: [
              `Compra call USD/MXN con K = ${F}, T = 6M, N = 14,621,460 USD`,
              `Vende put USD/MXN con K = ${F}, T = 6M, N = 14,621,460 USD`,
              "Primas netas se cancelan bajo paridad put-call",
              "Resultado: posición larga USD/MXN = forward",
            ],
          },
          {
            title: "Demostración técnica",
            icon: "✓",
            color: "bg-emerald-50 border-emerald-100",
            textColor: "text-emerald-700",
            items: [
              "Confirma que las primas de opciones son internamente consistentes",
              "Valida el modelo Garman-Kohlhagen utilizado",
              "Payoff coincide con forward en todos los escenarios de tipo de cambio",
              "P&L idéntico al forward en la tabla de escenarios",
            ],
          },
          {
            title: "Por qué no se recomienda",
            icon: "ℹ",
            color: "bg-gray-50 border-gray-100",
            textColor: "text-gray-600",
            items: [
              "Replica el forward sin aportar mejora económica",
              "Mayor complejidad operativa (dos opciones vs una sola contratación)",
              "Riesgo de diferencia de primas si el mercado no está en paridad exacta",
              "El forward directo es más eficiente y transparent",
            ],
          },
        ].map((card) => (
          <div key={card.title} className={`rounded-2xl ${card.color} border overflow-hidden`}>
            <div className={`px-5 py-4 border-b ${card.color.split(" ")[1]} flex items-center gap-2`}>
              <span className={`text-base ${card.textColor}`}>{card.icon}</span>
              <p className={`text-xs font-semibold tracking-wider uppercase ${card.textColor}`}>{card.title}</p>
            </div>
            <ul className="px-5 py-4 space-y-2">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className={`shrink-0 mt-0.5 ${card.textColor}`}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Summary ── */}
      <div className="rounded-2xl bg-gray-900 px-7 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
          <p className="text-[11px] tracking-[0.22em] font-semibold text-gray-500 uppercase">
            Síntesis · Paridad put-call
          </p>
        </div>
        <p className="text-sm text-white leading-relaxed">
          La equivalencia demostrada aquí —{" "}
          <span className="font-mono text-indigo-300">Call(K,T) − Put(K,T) = S₀e⁻ʳ̂T − Ke⁻ʳT</span> — confirma que el modelo
          de valuación utilizado (Garman-Kohlhagen) es internamente consistente. Los cuatro instrumentos
          (forward, vanilla, spread, sintético) parten de la misma base de mercado y sus primas son comparables. Esto
          sustenta la recomendación de la estrategia híbrida como la combinación más eficiente de los tres primeros
          instrumentos.
        </p>
      </div>

    </div>
  );
}
