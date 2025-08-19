from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from db import SessionLocal
from dependecies import get_current_user
from models.usuario import Usuario
from repositories.rutinas import RepositorioRutinas
from schemas.rutina import RutinaCrearSimple, RutinaRespuesta
from schemas.usuario import UsuarioCrear, UsuarioLogin, UsuarioRespuesta
from repositories.usuarios import RepositorioUsuarios

router = APIRouter()
repo_usuarios = RepositorioUsuarios()
repo_rutinas = RepositorioRutinas()

@router.get("/api/rutinas", tags=["Rutina"], response_model=List[RutinaRespuesta])
def listar_rutinas(nombre: Optional[str] = Query(None, min_length=1, max_length=100)):
    sesion = SessionLocal()
    try:
        if nombre:
            rutinas = repo_rutinas.buscar_por_nombre(sesion, nombre)
        else:
            rutinas = repo_rutinas.obtener_todos(sesion)
        print(rutinas)
        return rutinas
    finally:
        sesion.close()

    
@router.get("/api/rutinas/{id}", tags=["Rutina"], response_model=RutinaRespuesta)
def obtener_rutina(id: int):
    sesion = SessionLocal()
    rutina = repo_rutinas.obtener_por_id(sesion, id)

    if rutina is None:
        sesion.close()
        raise HTTPException(status_code=404, detail="Rutina no encontrada")

    sesion.close()
    return rutina
    
@router.post("/api/rutinas", tags=["Rutina"], response_model=RutinaRespuesta)
def crear_rutina(datos: RutinaCrearSimple, usuario: Usuario = Depends(get_current_user)):
    sesion = SessionLocal()

    nuevos_datos = {
        "nombre": datos.nombre,
        "descripcion": datos.descripcion,
        "nivel": datos.nivel,
        "usuarioId": usuario.id,
        "ejerciciosIds": datos.ejerciciosIds       
    }    
    
    nueva_rutina = repo_rutinas.crear(sesion, nuevos_datos)
    sesion.close()
    return nueva_rutina
