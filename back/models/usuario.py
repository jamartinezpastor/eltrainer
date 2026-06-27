# models/usuario.py

from sqlalchemy import Column, Integer, String
from db import Base
from sqlalchemy.orm import relationship

# Creamos una clase Usuario que hereda de Base (declarative_base)
# Esto indica que esta clase es un modelo de base de datos
class Usuario(Base):
    __tablename__ = "usuarios"  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True)  # ID autoincremental
    nombre = Column(String(100), nullable=False)             # Nombre del usuario
    email = Column(String(100), unique=True, nullable=False)  # Email único
    telefono = Column(String(20), nullable=False)           # Teléfono
    contrasena = Column(String(100), nullable=False)         # Contraseña (sin hash de momento)

    rutinas = relationship("Rutina", back_populates="usuario")