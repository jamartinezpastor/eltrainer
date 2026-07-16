"""
Importa el catálogo de ejercicios desde hasaneyldrm/exercises-dataset
(https://github.com/hasaneyldrm/exercises-dataset) y descarta los ejercicios
creados a mano que no vengan de esa fuente. Los GIFs no se descargan: se
enlazan a la CDN jsDelivr sobre el propio repo de GitHub.

Uso (desde back/, con el entorno virtual activado):
    python scripts/importar_ejercicios.py
"""
import os
import sys
import json
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import Base, engine, SessionLocal
from models.ejercicio import Ejercicio, RutinaEjercicio
from models.rutina import Rutina
from models.usuario import Usuario
from repositories.ejercicios import RepositorioEjercicios
from repositories.usuarios import RepositorioUsuarios
from services.auth_service import encriptar_contrasena

DATASET_URL = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json"
GIF_BASE_URL = "https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/"

DEMO_EMAIL = "demo@eltrainer.app"
DEMO_CONTRASENA = "demo1234"


def crear_usuario_demo(sesion):
    repo = RepositorioUsuarios()
    if repo.obtener_por_email(sesion, DEMO_EMAIL):
        return
    usuario = Usuario(
        nombre="Usuario Demo",
        email=DEMO_EMAIL,
        telefono="000000000",
        contrasena=encriptar_contrasena(DEMO_CONTRASENA),
    )
    sesion.add(usuario)
    sesion.commit()
    print(f"Usuario demo creado: {DEMO_EMAIL} / {DEMO_CONTRASENA}")


def descargar_dataset():
    with urllib.request.urlopen(DATASET_URL, timeout=60) as respuesta:
        return json.load(respuesta)


def main():
    Base.metadata.create_all(bind=engine)
    sesion = SessionLocal()
    repo = RepositorioEjercicios()

    try:
        crear_usuario_demo(sesion)

        print("Descargando dataset...")
        ejercicios = descargar_dataset()
        print(f"{len(ejercicios)} ejercicios encontrados en el dataset.")

        ids_manuales = [
            e.id for e in sesion.query(Ejercicio.id).filter(Ejercicio.external_id.is_(None)).all()
        ]
        if ids_manuales:
            sesion.query(RutinaEjercicio).filter(
                RutinaEjercicio.ejercicio_id.in_(ids_manuales)
            ).delete(synchronize_session=False)
            sesion.query(Ejercicio).filter(Ejercicio.id.in_(ids_manuales)).delete(synchronize_session=False)
            print(f"Eliminados {len(ids_manuales)} ejercicios creados a mano (sin external_id) y sus asociaciones a rutinas.")
        sesion.commit()

        for item in ejercicios:
            datos = {
                "external_id": item["id"],
                "nombre": item["name"],
                "grupoMuscular": item["body_part"],
                "gif_url": GIF_BASE_URL + item["gif_url"],
            }
            repo.upsert_por_external_id(sesion, datos)

        sesion.commit()

        total = sesion.query(Ejercicio).count()
        print(f"Importación completada. Total de ejercicios en la base de datos: {total}")
    finally:
        sesion.close()


if __name__ == "__main__":
    main()
