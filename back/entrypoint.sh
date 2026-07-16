#!/bin/sh
set -e

python - <<'PY'
from db import Base, engine, SessionLocal
from models import usuario, rutina, ejercicio
from models.ejercicio import Ejercicio

Base.metadata.create_all(bind=engine)

sesion = SessionLocal()
total = sesion.query(Ejercicio).count()
sesion.close()

if total == 0:
    print("Catalogo de ejercicios vacio, importando desde exercises-dataset...")
    import subprocess
    subprocess.run(["python", "scripts/importar_ejercicios.py"], check=True)
else:
    print(f"Catalogo ya poblado ({total} ejercicios), omitiendo importacion.")
PY

exec uvicorn main:app --host 0.0.0.0 --port 8000
