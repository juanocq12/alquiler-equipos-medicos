import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto-de-desarrollo';

export async function registerUser({ nombre, email, password, rol = 'CLIENTE' }) {
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
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

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  };
}

export async function loginUser({ email, password }) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const valido = await bcrypt.compare(password, usuario.passwordHash);
  if (!valido) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: usuario.id, email: usuario.email, role: usuario.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  };
}
