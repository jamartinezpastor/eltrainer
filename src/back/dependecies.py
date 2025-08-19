from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from services.auth_service import verificar_token
from repositories.usuarios import RepositorioUsuarios
from db import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/usuarios/login")
repo_usuarios = RepositorioUsuarios()

def get_current_user(token:str = Depends(oauth2_scheme)):
    datos_token = verificar_token(token)
    if datos_token == None or "sub"not in datos_token:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    """
    Un token seria algo así...
    {
        "sub": 6, # Identificador del usuario
        "exp": 1753961765 # Fecha de expiración en formato
    }
    """
    id_usuario = datos_token["sub"] # por eso ahora buscamos "sub"
    sesion = SessionLocal()
    usuario = repo_usuarios.obtener_por_id(sesion, id_usuario)
    sesion.close()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario
    