import type { KPI } from "@/lib/api";

interface Props {
  kpi: KPI;
}

export default function KPICard({ kpi }: Props) {
  const isPositive = kpi.change >= 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {kpi.value.toLocaleString("es-CL")}
        <span className="ml-1 text-base font-normal text-gray-400">{kpi.unit}</span>
      </p>
      <p
        className={`mt-1 text-sm font-medium ${
          isPositive ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {isPositive ? "+" : ""}
        {kpi.change}% vs periodo anterior
      </p>
    </div>
  );
}
