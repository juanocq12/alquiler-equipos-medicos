export class ErrorHttp extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = 'Datos inválidos') => new ErrorHttp(400, message);
export const unauthorized = (message = 'No autenticado') => new ErrorHttp(401, message);
export const forbidden = (message = 'No autorizado') => new ErrorHttp(403, message);
export const notFound = (message = 'Recurso no encontrado') => new ErrorHttp(404, message);
export const conflict = (message = 'Conflicto') => new ErrorHttp(409, message);
