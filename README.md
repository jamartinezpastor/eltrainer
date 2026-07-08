# eltrainer 💪

App de rutinas de entrenamiento que une un frontend **React** con un backend **Python/FastAPI**, comunicados por una API REST con autenticación JWT y persistencia en **SQLite**.

## Arquitectura

```
┌─────────────────────┐        fetch JSON         ┌──────────────────────┐
│  Frontend (React)   │  ───────────────────────► │  Backend (FastAPI)   │
│  Vite + TS + shadcn │   Authorization: Bearer   │  /api/... + Swagger  │
│  localhost:8080     │ ◄───────────────────────  │  localhost:8000      │
└─────────────────────┘                           └──────────┬───────────┘
                                                             │ SQLAlchemy
                                                        ┌────▼─────┐
                                                        │  SQLite  │
                                                        └──────────┘
```

- **Frontend** (raíz del repo): Vite + React + TypeScript + shadcn/ui. Los componentes llaman a la API con `fetch` usando la URL base definida en `src/lib/apiConfig.ts` (configurable con `VITE_API_URL`).
- **Backend** (`back/`): FastAPI con arquitectura en capas — `routers/` (endpoints) → `repositories/` (acceso a datos) → `models/` (SQLAlchemy) + `schemas/` (Pydantic). Documentación interactiva autogenerada con **Swagger** en `/docs`.
- **Autenticación**: el login devuelve un JWT firmado (`services/auth_service.py`, passlib + bcrypt para las contraseñas); el frontend lo envía en la cabecera `Authorization: Bearer <token>` en las rutas protegidas.
- **Base de datos**: SQLite vía SQLAlchemy (`back/db.py`). Las tablas se crean automáticamente al arrancar si no existen.

## Cómo se conectan

1. El backend expone la API bajo `/api` y habilita **CORS** para el origen del frontend (`back/main.py`), imprescindible porque cada uno corre en un puerto distinto.
2. El frontend registra/loguea usuarios contra `/api/usuarios`, guarda el token JWT y con él consume rutinas y ejercicios (`/api/rutinas`, `/api/ejercicios`).
3. Swagger (`http://127.0.0.1:8000/docs`) permite probar todos los endpoints sin el frontend: mismo contrato que consume React.

## Arrancar en local

**Backend** — API en http://127.0.0.1:8000 y Swagger en http://127.0.0.1:8000/docs:

```sh
cd back
python -m venv .venv                          # solo la primera vez
.venv\Scripts\pip install -r requirements.txt # solo la primera vez
.venv\Scripts\python -m uvicorn main:app --reload
```

**Frontend** — http://localhost:8080:

```sh
npm i          # solo la primera vez
npm run dev
```

No hace falta configurar nada más: el frontend apunta por defecto al backend local.

## Configuración (variables de entorno)

Ver [.env.example](.env.example). Todas son opcionales en desarrollo:

| Variable | Lado | Descripción |
|---|---|---|
| `VITE_API_URL` | Frontend | URL base de la API (por defecto `http://127.0.0.1:8000/api`) |
| `SECRET_KEY` | Backend | Clave de firma de los JWT |
| `CORS_ORIGINS` | Backend | Orígenes permitidos, separados por comas |
| `DATABASE_URL` | Backend | Conexión SQLAlchemy (por defecto SQLite local) |

## Stack

- **Frontend**: Vite, React 18, TypeScript, shadcn/ui, Tailwind CSS, GSAP
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), passlib/bcrypt, Uvicorn
- **Base de datos**: SQLite
