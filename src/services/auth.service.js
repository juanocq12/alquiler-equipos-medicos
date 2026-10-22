import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { conflict, unauthorized } from '../utils/errors.js';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }
  return secret;
}

function crearToken(usuario) {
  return jwt.sign(
    { userId: usuario.id, email: usuario.email, role: usuario.rol },
    getJwtSecret(),
    { expiresIn: '1h' }
  );
}

function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };
}

export async function registerUser({ nombre, email, password }) {
  const emailNormalizado = email.trim().toLowerCase();
  const existe = await prisma.usuario.findUnique({ where: { email: emailNormalizado } });
  if (existe) {
    throw conflict('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: {
      nombre: nombre.trim(),
      email: emailNormalizado,
      passwordHash,
      rol: 'CLIENTE'
    }
  });

  return { token: crearToken(usuario), usuario: usuarioPublico(usuario) };
}

export async function loginUser({ email, password }) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() }
  });
  if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
    throw unauthorized('Credenciales inválidas');
  }

  return { token: crearToken(usuario), usuario: usuarioPublico(usuario) };
}

export async function obtenerUsuarioAutenticado(userId) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true
    }
  });
  if (!usuario) {
    throw unauthorized('Usuario no encontrado');
  }
  return usuario;
}
