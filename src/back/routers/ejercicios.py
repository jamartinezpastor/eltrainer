from typing import List
from fastapi import APIRouter, HTTPException
from db import SessionLocal
from repositories.ejercicios import RepositorioEjercicios
from repositories.rutinas import RepositorioRutinas
from schemas.ejercicio import EjercicioCrear, EjercicioRespuesta
from schemas.rutina import RutinaRespuesta
from schemas.usuario import UsuarioCrear, UsuarioLogin, UsuarioRespuesta
from repositories.usuarios import RepositorioUsuarios

router = APIRouter()
repo_usuarios = RepositorioUsuarios()
repo_rutinas = RepositorioRutinas()
repo_ejercicios = RepositorioEjercicios()
sesion = SessionLocal()

@router.get("/api/ejercicios", tags=["Ejercicio"], response_model=List[EjercicioRespuesta])
def listar_ejercicios():
    return repo_ejercicios.obtener_todos(sesion)

@router.post("/api/ejercicios", tags=["Ejercicio"], response_model=EjercicioRespuesta)
def crear_ejercicio(datos: EjercicioCrear):
    sesion = SessionLocal()
    nuevo_ejercicio = repo_ejercicios.crear(sesion, datos)
    sesion.close()
    return nuevo_ejercicio