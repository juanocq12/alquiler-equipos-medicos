import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function listarEquipos({ disponibles = false } = {}) {
  const where = disponibles ? { stock: { gt: 0 } } : {};
  return prisma.equipo.findMany({
    where,
    orderBy: { nombre: 'asc' }
  });
}

export async function obtenerEquipo(id) {
  return prisma.equipo.findUnique({ where: { id } });
}

export async function crearEquipo(data) {
  return prisma.equipo.create({ data });
}

export async function actualizarEquipo(id, data) {
  return prisma.equipo.update({ where: { id }, data });
}

export async function eliminarEquipo(id) {
  return prisma.equipo.delete({ where: { id } });
}
