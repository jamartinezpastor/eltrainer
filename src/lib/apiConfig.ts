// URL base de la API. En producción se define VITE_API_URL en el build;
// en desarrollo usa el backend local por defecto.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
