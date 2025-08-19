from sqlalchemy import Column, ForeignKey, Integer, String, Table
from db import Base
from sqlalchemy.orm import relationship

rutina_ejercicio = Table(
    "rutina_ejercicio", Base.metadata,
    Column("rutina_id", Integer, ForeignKey("rutinas.id"), primary_key=True),
    Column("ejercicio_id", Integer, ForeignKey("ejercicios.id"), primary_key=True)
    )

class Ejercicio(Base):
    __tablename__ = "ejercicios" 

    id = Column(Integer, primary_key=True, index=True)  
    nombre = Column(String(100), nullable=False)          
    grupoMuscular = Column(String(50), nullable=False)  
    series = Column(Integer, nullable=False)         
    repeticiones = Column(Integer, nullable=False)        
    
    # rutinaId = Column(Integer, ForeignKey("rutinas.id"))
    
    rutinas = relationship("Rutina", secondary=rutina_ejercicio, back_populates="ejercicios")

