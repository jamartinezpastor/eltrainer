from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from schemas.ejercicio import EjercicioRespuesta

class RutinaCrearSimple(BaseModel):
    nombre: str
    descripcion: Optional[str]
    nivel: str
    # usuarioId: int
    ejerciciosIds: List[int]
    
class RutinaRespuesta(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    nivel: str
    usuarioId: int
    ejercicios: List[EjercicioRespuesta]
    
    class Config:
        from_attributes = True
