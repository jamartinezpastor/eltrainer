from pydantic import BaseModel
from datetime import datetime

class EjercicioRespuesta(BaseModel):
    id: int
    nombre: str
    grupoMuscular: str
    gif_url: str

    class Config:
        from_attributes = True