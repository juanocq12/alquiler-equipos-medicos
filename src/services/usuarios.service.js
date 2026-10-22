import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

const usuarioPublicoSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  createdAt: true
};

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' },
    select: usuarioPublicoSelect
  });
}

export async function obtenerUsuario(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: usuarioPublicoSelect
  });
}

export async function crearUsuario({ nombre, email, password, rol = 'CLIENTE' }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.usuario.create({
    data: {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      rol
    },
    select: usuarioPublicoSelect
  });
}
