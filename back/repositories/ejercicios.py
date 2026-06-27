from models.rutina import Rutina
from repositories.base import RepositorioBase
from models.ejercicio import Ejercicio
from sqlalchemy.orm import Session

class RepositorioEjercicios(RepositorioBase):
    def __init__(self):
        super().__init__(Ejercicio)

    def crear(self, session, datos):
        nuevo_ejercicio = Ejercicio(
            nombre=datos.nombre,
            grupoMuscular=datos.grupoMuscular,
            series=datos.series,
            repeticiones=datos.repeticiones
        )
        session.add(nuevo_ejercicio)
        session.commit()
        session.refresh(nuevo_ejercicio)
        return nuevo_ejercicio
    
    # Recupera los ejercicios que están asociados a una rutina concreta.
    def obtener_por_rutina(self, session, rutina_id):
        rutina = self.obtener_por_id(rutina_id)            
        return rutina.ejercicios