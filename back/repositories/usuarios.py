from repositories.base import RepositorioBase
from models.usuario import Usuario
from sqlalchemy.orm import Session

class RepositorioUsuarios(RepositorioBase):
    def __init__(self):
        super().__init__(Usuario)

    def crear(self, session, datos):
        nuevo = Usuario(
            nombre=datos.nombre,
            email=datos.email,
            telefono=datos.telefono,
            contrasena=datos.contrasena
        )
        session.add(nuevo)
        session.commit()
        session.refresh(nuevo)
        return nuevo

    def obtener_por_email(self, session, email):
        return session.query(Usuario).filter(Usuario.email == email).first()
