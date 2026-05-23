# Reto ARAUCO

Dashboard operacional con **Next.js** (frontend) + **FastAPI** (backend).

## Estructura

```
.
├── frontend/   # Next.js 15, TypeScript, Tailwind CSS
└── backend/    # FastAPI, Python 3.11+
```

## Levantar el backend

```bash
cd backend

# Crear entorno virtual (solo la primera vez)
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Correr servidor en http://localhost:8000
python run.py
```

Docs automáticas disponibles en: http://localhost:8000/docs

## Levantar el frontend

```bash
cd frontend
npm install   # si no se hizo aún
npm run dev   # http://localhost:3000
```

## Variables de entorno

| Archivo                      | Variable                | Valor por defecto              |
|------------------------------|-------------------------|-------------------------------|
| `frontend/.env.local`        | `NEXT_PUBLIC_API_URL`   | `http://localhost:8000/api`   |
