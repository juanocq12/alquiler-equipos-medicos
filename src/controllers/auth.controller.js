import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorHttp, conflict, unauthorized } from '../utils/errors.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto-de-desarrollo';

export async function register(req, res, next) {
  try {
    const { nombre, email, password, rol = 'CLIENTE' } = req.body;

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return next(conflict('El email ya está registrado'));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol
      }
    });

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email, role: usuario.rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return next(unauthorized('Credenciales inválidas'));
    }

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      return next(unauthorized('Credenciales inválidas'));
    }

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email, role: usuario.rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    });

    if (!usuario) {
      return next(unauthorized('Usuario no encontrado'));
    }

    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}
