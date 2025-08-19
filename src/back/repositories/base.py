class RepositorioBase:
    def __init__(self, modelo):
        self.modelo = modelo  # Modelo SQLAlchemy (como Usuario o Actividad)

    # Obtener todos los registros del modelo
    def obtener_todos(self, session):
        return session.query(self.modelo).all()
    
    # Obtener un objeto por su ID
    def obtener_por_id(self, session, id):
        return session.query(self.modelo).filter(self.modelo.id == id).first()

    def eliminar(self, modelo):
        self.session.delete(modelo)
        self.session.commit()

    def actualizar(self, sesion, id, nuevos_datos):
        raise NotImplementedError("Este método debe implementarse en el repositorio específico.")

        


    # # Crear un nuevo registro a mano (se sobreescribe en cada repositorio hijo)
    # def crear(self, session, datos):
    #     raise NotImplementedError("Este método debe implementarse en el repositorio específico.")
