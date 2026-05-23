const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export interface KPI {
  label: string;
  value: number;
  unit: string;
  change: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartSeries {
  title: string;
  data: ChartDataPoint[];
}

export interface MacroItem {
  label: string;
  value: number | null;
  display: string | null;
  unit: string;
  change: number | null;
}

export interface MacroGroup {
  category: string;
  items: MacroItem[];
}

export const api = {
  getKPIs: () => fetchAPI<KPI[]>("/dashboard/kpis"),
  getProduccionMensual: () => fetchAPI<ChartSeries>("/dashboard/produccion-mensual"),
  getEficienciaPorPlanta: () => fetchAPI<ChartSeries>("/dashboard/eficiencia-por-planta"),
  getMacro: () => fetchAPI<MacroGroup[]>("/dashboard/macro"),
};
