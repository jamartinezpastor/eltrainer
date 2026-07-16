from sqlalchemy import Column, ForeignKey, Integer, String
from db import Base
from sqlalchemy.orm import relationship


class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(10), unique=True, index=True, nullable=True)
    nombre = Column(String(100), nullable=False)
    grupoMuscular = Column(String(50), nullable=False)
    gif_url = Column(String(300), nullable=False)


class RutinaEjercicio(Base):
    __tablename__ = "rutina_ejercicio"

    rutina_id = Column(Integer, ForeignKey("rutinas.id", ondelete="CASCADE"), primary_key=True)
    ejercicio_id = Column(Integer, ForeignKey("ejercicios.id"), primary_key=True)
    series = Column(Integer, nullable=False)
    repeticiones = Column(Integer, nullable=False)

    rutina = relationship("Rutina", back_populates="ejercicios_rutina")
    ejercicio = relationship("Ejercicio", lazy="joined")
