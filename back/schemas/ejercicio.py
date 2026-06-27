from pydantic import BaseModel
from datetime import datetime

class EjercicioCrear(BaseModel):
    nombre: str
    grupoMuscular: str
    series: int
    repeticiones: int

class EjercicioRespuesta(BaseModel):
    id: int
    nombre: str
    grupoMuscular: str
    series: int
    repeticiones: int
    
    class Config:
        from_attributes = True