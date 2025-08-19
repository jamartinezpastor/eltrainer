from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine, SessionLocal 
from models import usuario, rutina, ejercicio
from routers import ejercicios, rutinas, usuarios
from db import SessionLocal
from models.usuario import Usuario
from models.rutina import Rutina
from models.ejercicio import Ejercicio

# Creamos la instancia principal de la app FastAPI
app = FastAPI(title="API TrainUp 💪🏋️ 2.0")
# Configuramos CORS para permitir que el frontend acceda a la API
app.add_middleware( CORSMiddleware, allow_origins=[ "http://127.0.0.1:5501","http://localhost:5501","http://127.0.0.1:8000","http://localhost:8000"], # Durante desarrollo, permitimos cualquier origen
                   allow_credentials=True, allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"], )

# Creamos las tablas automáticamente si no existen
Base.metadata.create_all(bind=engine)
# Incluimos los routers de cada recurso
app.include_router(usuarios.router)
app.include_router(rutinas.router)
app.include_router(ejercicios.router)

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a TrainUp API"}