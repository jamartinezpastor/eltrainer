import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# En producción define SECRET_KEY como variable de entorno (ej. openssl rand -hex 32)
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-insecure-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"])

def encriptar_contrasena(password):
    contrasena_cifrada = pwd_context.hash(password)
    return contrasena_cifrada

def verificar_contrasena(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password) # devuelve True o False

def crear_token_acceso(datos):
    copia = datos.copy()
    
    expiracion = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    copia.update({"exp":expiracion})
    return jwt.encode(copia, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # nos devuelve los datos utiles
        return payload
    except JWTError:
        return None