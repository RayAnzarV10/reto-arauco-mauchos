from pydantic import BaseModel


class KPI(BaseModel):
    label: str
    value: float
    unit: str
    change: float


class ChartDataPoint(BaseModel):
    name: str
    value: float


class ChartSeries(BaseModel):
    title: str
    data: list[ChartDataPoint]


class MacroItem(BaseModel):
    label: str
    value: float | None
    display: str | None = None  # override del texto mostrado (ej. rangos "3.50–3.75")
    unit: str
    change: float | None  # % vs cierre anterior


class MacroGroup(BaseModel):
    category: str
    items: list[MacroItem]
