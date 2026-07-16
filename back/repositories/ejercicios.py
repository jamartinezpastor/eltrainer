from models.rutina import Rutina
from repositories.base import RepositorioBase
from models.ejercicio import Ejercicio
from sqlalchemy.orm import Session

class RepositorioEjercicios(RepositorioBase):
    def __init__(self):
        super().__init__(Ejercicio)

    def upsert_por_external_id(self, session, datos):
        ejercicio = session.query(Ejercicio).filter(Ejercicio.external_id == datos["external_id"]).first()
        if ejercicio is None:
            ejercicio = Ejercicio(**datos)
            session.add(ejercicio)
        else:
            for campo, valor in datos.items():
                setattr(ejercicio, campo, valor)
        return ejercicio

    def buscar_por_grupo_muscular(self, session, grupo_muscular: str):
        return session.query(Ejercicio).filter(Ejercicio.grupoMuscular == grupo_muscular).all()

    # Recupera los ejercicios que están asociados a una rutina concreta.
    def obtener_por_rutina(self, session, rutina_id):
        rutina = self.obtener_por_id(rutina_id)
        return rutina.ejercicios