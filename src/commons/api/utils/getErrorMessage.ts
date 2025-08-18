import type { SerializedError } from "@reduxjs/toolkit"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"


function isSerializedError(error: FetchBaseQueryError | SerializedError): error is SerializedError {
  return 'message' in error
}

export const SERIALIZED_ERROR_MESSAGE = "Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde."

export const NETWORK_ERROR_MESSAGE = "No fue posible establecer una conexión con el servidor. Por favor, verifica tu conexión a Internet o inténtalo nuevamente más tarde."
export const DEFAULT_SERVER_ERROR_MESSAGE = "El servidor devolvió una respuesta inesperada. Si el problema persiste, por favor contacte al soporte técnico."
export const PARSING_ERROR_MESSAGE = DEFAULT_SERVER_ERROR_MESSAGE
export const TIMEOUT_ERROR_MESSAGE = "La conexión con el servidor ha demorado más de lo esperado. Esto podría ser un problema temporal en el servidor o a problemas con su conexión a Internet. Intente nuevamente en unos momentos."



export function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if (isSerializedError(error)) {
    return error.message || SERIALIZED_ERROR_MESSAGE
  }
  else if (error.status == 'FETCH_ERROR') {
    return NETWORK_ERROR_MESSAGE
  }
  else if (error.status == 'PARSING_ERROR') {
    return PARSING_ERROR_MESSAGE
  }
  else if (error.status == 'TIMEOUT_ERROR') {
    return TIMEOUT_ERROR_MESSAGE
  }
  else if (error.status == 'CUSTOM_ERROR') {
    return error.error || 'Error personalizado sin mensaje específico.'
  }
  else if (error.status == 422) {
    return 'Hay errores en uno o más campos.'
  }
  else {
    return (error.data as { message?: string })?.message || DEFAULT_SERVER_ERROR_MESSAGE
  }
}