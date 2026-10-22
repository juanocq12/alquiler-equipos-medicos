import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../utils/errors.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
    return next(unauthorized('Token no enviado'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error('JWT_SECRET no está configurado'));
  }

  try {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const payload = jwt.verify(token, secret);
    if (!payload || typeof payload !== 'object' ||
        !Number.isInteger(payload.userId) ||
        !['CLIENTE', 'ADMIN'].includes(payload.role)) {
      return next(unauthorized('Token inválido o expirado'));
    }
    req.user = payload;
    return next();
  } catch {
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
