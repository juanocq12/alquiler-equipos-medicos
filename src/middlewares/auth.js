import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto-de-desarrollo';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorized('Token no enviado'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return next(unauthorized('Token inválido o expirado'));
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(unauthorized('No autenticado'));
    }

    if (req.user.role !== role) {
      return next(forbidden('No tienes permisos para esta acción'));
    }

    next();
  };
}
