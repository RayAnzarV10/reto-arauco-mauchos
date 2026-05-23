import Image from "next/image";

const categories = [
  {
    title: "Escala Global",
    highlight: "11 países",
    stats: ["Más de 3.500 clientes en los cinco continentes", "29 oficinas en Asia, América, Europa y Medio Oriente"],
  },
  {
    title: "Patrimonio Forestal",
    highlight: "1,8 M ha",
    stats: ["27% en conservación de alto valor ambiental", "Operaciones en Chile, Argentina, Brasil y Uruguay"],
  },
  {
    title: "Capacidad Productiva",
    highlight: "4,6 M ton",
    stats: ["Celulosa producida anualmente", "7,6 millones de m³ de madera y paneles por año"],
  },
  {
    title: "Personas",
    highlight: "19.100",
    stats: ["Trabajadores directos", "32.000 colaboradores indirectos en 2.030 empresas"],
  },
  {
    title: "Sustentabilidad",
    highlight: "N.° 1",
    stats: ["Primera empresa forestal carbono neutral del mundo", "USD 43 millones invertidos en I+D a través de Bioforest"],
  },
  {
    title: "Energía",
    highlight: "1.051 MW",
    stats: ["Capacidad instalada de energía renovable", "Margen EBITDA ajustado del 22%"],
  },
];

export function InfoSection() {
  return (
    <section className="bg-neutral-950 text-white">
      {/* Stats grid */}
      <div className="px-8 pt-24 pb-16 md:px-16 lg:px-24">
        <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase mb-12">
          ARAUCO en cifras
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-neutral-950 p-8 flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                {cat.title}
              </span>
              <span className="text-5xl font-bold leading-none tracking-tight">
                {cat.highlight}
              </span>
              <ul className="mt-2 space-y-1.5">
                {cat.stats.map((item, i) => (
                  <li key={i} className="text-sm text-neutral-400 leading-snug flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose quote */}
      <div className="px-8 py-24 md:px-16 lg:px-24 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase mb-8">
            Propósito
          </p>
          <blockquote className="text-3xl md:text-5xl font-bold leading-tight">
            "Renovables para una vida mejor"
          </blockquote>
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
            Transformar madera en soluciones que impulsan economías locales y globales.
          </p>
        </div>
      </div>

      {/* Team credit */}
      <div className="px-8 py-6 md:px-16 lg:px-24 border-t border-neutral-800 flex items-center justify-center gap-3">
        <Image src="/mauchos_logo.png" alt="Mauchos" width={70} height={16} className="brightness-0 invert opacity-30" />
        <span className="text-neutral-700">·</span>
        <p className="text-[11px] font-semibold tracking-[0.28em] text-neutral-600 uppercase">
          Reto ARAUCO 2026
        </p>
      </div>
    </section>
  );
}
