# routers/usuarios.py

from typing import List
from fastapi import APIRouter, HTTPException
from db import SessionLocal
from models import usuario
from repositories.rutinas import RepositorioRutinas
from schemas.rutina import RutinaRespuesta
from schemas.usuario import UsuarioConToken, UsuarioCrear, UsuarioLogin, UsuarioRespuesta
from repositories.usuarios import RepositorioUsuarios
from services.auth_service import crear_token_acceso, encriptar_contrasena, verificar_contrasena

router = APIRouter()
repo_usuarios = RepositorioUsuarios()
repo_rutinas = RepositorioRutinas()

# Registrar un nuevo usuario
@router.post("/api/usuarios", tags=["Usuario"], response_model=UsuarioRespuesta)
def crear_usuario(datos: UsuarioCrear):
    sesion = SessionLocal()

    existente = repo_usuarios.obtener_por_email(sesion, datos.email)
    if existente:
        sesion.close()
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    datos_con_cifrado = datos.model_copy()
    datos_con_cifrado.contrasena = encriptar_contrasena(datos_con_cifrado.contrasena)

    nuevo_usuario = repo_usuarios.crear(sesion, datos_con_cifrado)
    sesion.close()
    return nuevo_usuario

# Iniciar sesión
@router.post("/api/usuarios/login", tags=["Usuario"], response_model=UsuarioConToken)
def login(datos: UsuarioLogin):
    sesion = SessionLocal()

    usuario = repo_usuarios.obtener_por_email(sesion, datos.email)
    if not usuario or not verificar_contrasena(datos.contrasena, usuario.contrasena):
        sesion.close()
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    
    token = crear_token_acceso({"sub":str(usuario.id)})
    print(token)

    sesion.close()
    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "telefono": usuario.telefono,
        "access_token": token,
        "token_type": "bearer"
        }

# Devuelve todas las rutinas creadas por el usuario con ID indicado.
@router.get("/api/usuarios/{id}/rutinas", tags=["Usuario"], response_model=List[RutinaRespuesta])
def rutinas_usuario(id: int):
    sesion = SessionLocal()
    usuario = repo_usuarios.obtener_por_id(sesion, id)
    rutinas = repo_rutinas.obtener_por_usuario(sesion, usuario.id)
    return rutinas