import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true
    }
  });
}

export async function obtenerUsuario(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true
    }
  });
}

export async function crearUsuario(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      passwordHash,
      rol: data.rol || 'CLIENTE'
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true
    }
  });
}
