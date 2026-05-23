import yfinance as yf
from fastapi import APIRouter
from app.models.schemas import KPI, ChartSeries, ChartDataPoint, MacroGroup, MacroItem

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _fetch(symbol: str) -> tuple[float | None, float | None]:
    try:
        hist = yf.Ticker(symbol).history(period="2d")
        if hist.empty:
            return None, None
        price = round(float(hist["Close"].iloc[-1]), 4)
        change = None
        if len(hist) >= 2:
            prev = float(hist["Close"].iloc[-2])
            change = round((price - prev) / prev * 100, 2)
        return price, change
    except Exception:
        return None, None


@router.get("/kpis", response_model=list[KPI])
def get_kpis():
    return [
        KPI(label="Producción Total", value=12450, unit="ton", change=5.2),
        KPI(label="Eficiencia", value=87.3, unit="%", change=-1.4),
        KPI(label="Incidentes", value=3, unit="eventos", change=-25.0),
        KPI(label="Consumo Energético", value=4320, unit="MWh", change=2.1),
    ]


@router.get("/produccion-mensual", response_model=ChartSeries)
def get_produccion_mensual():
    meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
             "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    valores = [9800, 10200, 11000, 10500, 12000, 11800,
               12450, 11900, 12100, 12300, 11700, 12450]
    return ChartSeries(
        title="Producción Mensual (ton)",
        data=[ChartDataPoint(name=m, value=v) for m, v in zip(meses, valores)],
    )


@router.get("/eficiencia-por-planta", response_model=ChartSeries)
def get_eficiencia_por_planta():
    plantas = [
        ("Planta A", 91.2),
        ("Planta B", 85.7),
        ("Planta C", 78.4),
        ("Planta D", 88.9),
        ("Planta E", 82.1),
    ]
    return ChartSeries(
        title="Eficiencia por Planta (%)",
        data=[ChartDataPoint(name=p, value=v) for p, v in plantas],
    )


@router.get("/macro", response_model=list[MacroGroup])
def get_macro():
    usdmxn, usdmxn_ch = _fetch("USDMXN=X")
    usdclp, usdclp_ch = _fetch("USDCLP=X")
    eurusd, eurusd_ch = _fetch("EURUSD=X")
    ng, ng_ch = _fetch("NG=F")
    brent, brent_ch = _fetch("BZ=F")

    return [
        MacroGroup(category="Divisas", items=[
            MacroItem(label="USD / MXN", value=usdmxn, unit="MXN", change=usdmxn_ch),
            MacroItem(label="USD / CLP", value=usdclp, unit="CLP", change=usdclp_ch),
            MacroItem(label="EUR / USD", value=eurusd, unit="USD", change=eurusd_ch),
        ]),
        MacroGroup(category="Commodities", items=[
            MacroItem(label="Urea", value=ng, unit="Proxy: Gas Natural HH", change=ng_ch),
            MacroItem(label="Metanol", value=ng, unit="Proxy: Gas Natural HH", change=ng_ch),
            MacroItem(label="Petróleo Brent", value=brent, unit="USD/bbl", change=brent_ch),
        ]),
        MacroGroup(category="Tasas & Macro", items=[
            MacroItem(label="Tasa Banxico", value=6.50, unit="%", change=None),
            MacroItem(label="Tasa Fed", value=None, display="3.50–3.75", unit="%", change=None),
            MacroItem(label="Inflación México (IPC)", value=4.45, unit="% anual", change=None),
        ]),
    ]
