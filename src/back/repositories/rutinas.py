from repositories.base import RepositorioBase
from models.rutina import Rutina
from models.ejercicio import Ejercicio
from sqlalchemy.orm import Session

class RepositorioRutinas(RepositorioBase):
    def __init__(self):
        super().__init__(Rutina)

    def crear(self, session, datos):         
        ejercicios_guardados = []
        for e_id in datos["ejerciciosIds"]:
            e = session.query(Ejercicio).filter(Ejercicio.id == e_id).first()
            ejercicios_guardados.append(e)
      
        nueva_rutina = Rutina(
            nombre = datos["nombre"],
            descripcion = datos["descripcion"],
            nivel = datos["nivel"],
            ejercicios = ejercicios_guardados,
            usuarioId = datos["usuarioId"]          
        )
        session.add(nueva_rutina)
        session.commit()
        session.refresh(nueva_rutina)
        return nueva_rutina

    def obtener_por_usuario(self, session, usu_id):
        return session.query(Rutina).filter(Rutina.usuarioId == usu_id).all()

    def buscar_por_nombre(self, sesion, nombre: str):
        # SQLite: LIKE ya es insensible a mayúsculas/minúsculas por defecto
        return sesion.query(Rutina).filter(Rutina.nombre.like(f"%{nombre}%")).all()