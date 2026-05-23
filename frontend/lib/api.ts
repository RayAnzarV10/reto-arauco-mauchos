const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchAPI<T>(path: string, fallback: T): Promise<T> {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  } catch {
    return fallback;
  }
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

// Mock data
const MOCK_KPIS: KPI[] = [
  { label: "Tipo de cambio USD/MXN", value: 17.25, unit: "MXN", change: -0.8 },
  { label: "Precio celulosa BHKP", value: 645, unit: "USD/ton", change: 2.1 },
  { label: "Exposición FX neta", value: 120, unit: "MUSD", change: 0 },
  { label: "Cobertura activa", value: 68, unit: "%", change: 5.2 },
];

const MOCK_PRODUCCION: ChartSeries = {
  title: "Producción mensual",
  data: [
    { name: "Ene", value: 420 },
    { name: "Feb", value: 390 },
    { name: "Mar", value: 450 },
    { name: "Abr", value: 470 },
    { name: "May", value: 460 },
    { name: "Jun", value: 490 },
  ],
};

const MOCK_EFICIENCIA: ChartSeries = {
  title: "Eficiencia por planta",
  data: [
    { name: "Planta A", value: 87 },
    { name: "Planta B", value: 92 },
    { name: "Planta C", value: 78 },
    { name: "Planta D", value: 95 },
  ],
};

const MOCK_MACRO: MacroGroup[] = [
  {
    category: "Divisas",
    items: [
      { label: "USD / MXN", value: 17.31, display: null, unit: "MXN", change: 0.08 },
      { label: "USD / CLP", value: 900.71, display: null, unit: "CLP", change: 0.33 },
      { label: "EUR / USD", value: 1.1605, display: null, unit: "USD", change: -0.17 },
    ],
  },
  {
    category: "Commodities",
    items: [
      { label: "Urea", value: 2.91, display: null, unit: "Proxy: Gas Natural HH", change: -3.68 },
      { label: "Metanol", value: 2.91, display: null, unit: "Proxy: Gas Natural HH", change: -3.68 },
      { label: "Petróleo Brent", value: 103.54, display: null, unit: "USD/bbl", change: 0.94 },
    ],
  },
  {
    category: "Tasas & Macro",
    items: [
      { label: "Tasa Banxico", value: 6.50, display: null, unit: "%", change: null },
      { label: "Tasa Fed", value: null, display: "3.50–3.75", unit: "%", change: null },
      { label: "Inflación México (IPC)", value: 4.45, display: null, unit: "% anual", change: null },
    ],
  },
];

export const api = {
  getKPIs: () => fetchAPI<KPI[]>("/dashboard/kpis", MOCK_KPIS),
  getProduccionMensual: () => fetchAPI<ChartSeries>("/dashboard/produccion-mensual", MOCK_PRODUCCION),
  getEficienciaPorPlanta: () => fetchAPI<ChartSeries>("/dashboard/eficiencia-por-planta", MOCK_EFICIENCIA),
  getMacro: () => fetchAPI<MacroGroup[]>("/dashboard/macro", MOCK_MACRO),
};