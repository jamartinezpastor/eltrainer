from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from db import SessionLocal
from repositories.ejercicios import RepositorioEjercicios
from repositories.rutinas import RepositorioRutinas
from schemas.ejercicio import EjercicioRespuesta
from schemas.rutina import RutinaRespuesta
from schemas.usuario import UsuarioCrear, UsuarioLogin, UsuarioRespuesta
from repositories.usuarios import RepositorioUsuarios

router = APIRouter()
repo_usuarios = RepositorioUsuarios()
repo_rutinas = RepositorioRutinas()
repo_ejercicios = RepositorioEjercicios()

@router.get("/api/ejercicios", tags=["Ejercicio"], response_model=List[EjercicioRespuesta])
def listar_ejercicios(grupoMuscular: Optional[str] = Query(None, min_length=1, max_length=50)):
    sesion = SessionLocal()
    try:
        if grupoMuscular:
            return repo_ejercicios.buscar_por_grupo_muscular(sesion, grupoMuscular)
        return repo_ejercicios.obtener_todos(sesion)
    finally:
        sesion.close()