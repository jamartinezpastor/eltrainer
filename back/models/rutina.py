from sqlalchemy import Column, ForeignKey, Integer, String, Table
from db import Base
from sqlalchemy.orm import relationship

class Rutina(Base):
    __tablename__ = "rutinas" 
    
    id = Column(Integer, primary_key=True, index=True)  
    nombre = Column(String(100), nullable=False)            
    descripcion = Column(String(300))  
    nivel = Column(String(30), nullable=False)           
    
    usuarioId = Column(Integer, ForeignKey("usuarios.id"))

    usuario = relationship("Usuario", back_populates="rutinas")
    ejercicios_rutina = relationship(
        "RutinaEjercicio", back_populates="rutina", cascade="all, delete-orphan", lazy="joined"
    )
    
    @property
    def ejercicios(self):
        return [
            {
                "id": re.ejercicio.id,
                "nombre": re.ejercicio.nombre,
                "grupoMuscular": re.ejercicio.grupoMuscular,
                "gif_url": re.ejercicio.gif_url,
                "series": re.series,
                "repeticiones": re.repeticiones,
            }
            for re in self.ejercicios_rutina
        ]

    def __repr__(self):
        return f"{self.id},{self.nombre}, {self.descripcion}{self.nivel}, {self.usuarioId}"