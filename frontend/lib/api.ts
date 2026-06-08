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

// Datos del modelo — Entregable Final ARAUCO · Junio 2026
// Fuentes: Banco de México, Fed, World Bank Commodity Outlook Abr 2026,
// nota socio formador (urea/metanol), NYU Stern V-Lab (volatilidad)
const MACRO_DATA: MacroGroup[] = [
  {
    category: "Divisas",
    items: [
      // Spot base del modelo de cobertura (Banxico FIX · Jun 2026)
      { label: "USD / MXN", value: 17.4563, display: null, unit: "MXN", change: -0.37 },
      // FRED DEXMXUS / Bloomberg · consolidado holding chileno
      { label: "USD / CLP", value: 900.71, display: null, unit: "CLP", change: 0.33 },
      // Relevante para maquinaria y repuestos europeos
      { label: "EUR / USD", value: 1.1605, display: null, unit: "USD", change: -0.17 },
    ],
  },
  {
    category: "Commodities",
    items: [
      // Precio histórico de compra — nota socio formador (Tabla 1, Entregable Final)
      { label: "Urea", value: 665, display: null, unit: "USD/t", change: 5.26 },
      // Precio histórico de compra — nota socio formador (Tabla 1, Entregable Final)
      { label: "Metanol", value: 1486.30, display: null, unit: "USD/t", change: 3.82 },
      // EIA Brent Spot FOB · choque energético +17.9% YoY
      { label: "Petróleo Brent", value: 84.87, display: null, unit: "USD/bbl", change: 1.12 },
    ],
  },
  {
    category: "Tasas & Macro",
    items: [
      // Banxico — ciclo de recortes cerrado en mayo 2026
      { label: "Tasa Banxico", value: 6.50, display: null, unit: "%", change: null },
      // Fed — FOMC dividido; rango objetivo
      { label: "Tasa Fed", value: null, display: "3.50–3.75", unit: "%", change: null },
      // INEGI · IPC — por encima del techo de Banxico (3% ±1%)
      { label: "Inflación México (IPC)", value: 4.45, display: null, unit: "% anual", change: null },
    ],
  },
];

export const api = {
  getKPIs: () => fetchAPI<KPI[]>("/dashboard/kpis", MOCK_KPIS),
  getProduccionMensual: () => fetchAPI<ChartSeries>("/dashboard/produccion-mensual", MOCK_PRODUCCION),
  getEficienciaPorPlanta: () => fetchAPI<ChartSeries>("/dashboard/eficiencia-por-planta", MOCK_EFICIENCIA),
  getMacro: () => Promise.resolve(MACRO_DATA),
};