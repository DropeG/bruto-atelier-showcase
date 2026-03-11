import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Hook helper para navegar hacia atrás con fallback.
// Uso: const goBack = useNavigateBack("/"); goBack();
export function useNavigateBack(fallback: string = "/") {
  const navigate = useNavigate();

  return useCallback(() => {
    try {
      // Si hay historial en el navegador, retrocede.
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
    } catch (e) {
      // en entorno donde window no existe (SSR) o si falla, caemos al fallback
    }

    // Fallback a ruta segura
    navigate(fallback);
  }, [navigate, fallback]);
}
