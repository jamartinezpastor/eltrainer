# schemas/usuario.py

from pydantic import BaseModel

# Este esquema representa lo que recibimos del frontend al registrar un nuevo usuario
class UsuarioCrear(BaseModel):
    nombre: str
    email: str
    telefono: str
    contrasena: str

# Este esquema representa lo que recibimos en un login (solo email y contraseña)
class UsuarioLogin(BaseModel):
    email: str
    contrasena: str

# Este esquema representa lo que devolvemos al frontend una vez el usuario se ha creado o ha iniciado sesión
class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: str
    telefono: str

    # Esta opción permite que FastAPI convierta automáticamente el modelo de SQLAlchemy en un esquema de respuesta
    class Config:
        from_attributes = True

class UsuarioConToken(BaseModel):
    id: int
    nombre: str
    email: str
    telefono: str
    access_token: str
    token_type: str