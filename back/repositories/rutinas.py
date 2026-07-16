from repositories.base import RepositorioBase
from models.rutina import Rutina
from models.ejercicio import Ejercicio, RutinaEjercicio
from sqlalchemy.orm import Session

class RepositorioRutinas(RepositorioBase):
    def __init__(self):
        super().__init__(Rutina)

    def crear(self, session, datos):
        nueva_rutina = Rutina(
            nombre = datos["nombre"],
            descripcion = datos["descripcion"],
            nivel = datos["nivel"],
            usuarioId = datos["usuarioId"]
        )
        nueva_rutina.ejercicios_rutina = [
            RutinaEjercicio(
                ejercicio_id=e["ejercicioId"],
                series=e["series"],
                repeticiones=e["repeticiones"],
            )
            for e in datos["ejercicios"]
        ]
        session.add(nueva_rutina)
        session.commit()
        session.refresh(nueva_rutina)
        _ = nueva_rutina.ejercicios  # fuerza la carga antes de que se cierre la sesión
        return nueva_rutina

    def actualizar(self, session, rutina_id, datos):
        rutina = session.query(Rutina).filter(Rutina.id == rutina_id).first()
        if rutina is None:
            return None

        rutina.nombre = datos["nombre"]
        rutina.descripcion = datos["descripcion"]
        rutina.nivel = datos["nivel"]
        rutina.ejercicios_rutina = [
            RutinaEjercicio(
                ejercicio_id=e["ejercicioId"],
                series=e["series"],
                repeticiones=e["repeticiones"],
            )
            for e in datos["ejercicios"]
        ]
        session.commit()
        session.refresh(rutina)
        _ = rutina.ejercicios  # fuerza la carga antes de que se cierre la sesión
        return rutina

    def obtener_por_usuario(self, session, usu_id):
        return session.query(Rutina).filter(Rutina.usuarioId == usu_id).all()

    def buscar_por_nombre(self, sesion, nombre: str):
        # SQLite: LIKE ya es insensible a mayúsculas/minúsculas por defecto
        return sesion.query(Rutina).filter(Rutina.nombre.like(f"%{nombre}%")).all()