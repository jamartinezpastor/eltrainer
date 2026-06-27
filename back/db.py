from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base # URL de conexión a la base de datos SQLite (archivo local)

DATABASE_URL = "sqlite:///./fastrainer.db" # Creamos el motor de conexión
engine = create_engine( DATABASE_URL, connect_args={"check_same_thread": False}) # Necesario para SQLite
# Creamos la clase SessionLocal para abrir sesiones con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Declarative Base es la clase base para todos los modelos 
Base = declarative_base()