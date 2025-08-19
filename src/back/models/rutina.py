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
    ejercicios = relationship("Ejercicio", secondary="rutina_ejercicio", back_populates="rutinas", lazy="joined")
    
    def __repr__(self):
        return f"{self.id},{self.nombre}, {self.descripcion}{self.nivel}, {self.usuarioId}"