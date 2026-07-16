from typing import List, Optional
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from datetime import datetime

class EjercicioEnRutina(BaseModel):
    ejercicioId: int
    series: int
    repeticiones: int

class RutinaCrearSimple(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    nivel: str
    # usuarioId: int
    ejercicios: List[EjercicioEnRutina]

class EjercicioEnRutinaRespuesta(BaseModel):
    id: int
    nombre: str
    grupoMuscular: str
    gif_url: str
    series: int
    repeticiones: int

class RutinaRespuesta(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    nivel: str
    usuarioId: int
    ejercicios: List[EjercicioEnRutinaRespuesta]

    class Config:
        from_attributes = True
