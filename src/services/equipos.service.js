import prisma from '../utils/prisma.js';

export async function listarEquipos({ disponibles = false } = {}) {
  const where = disponibles ? { stock: { gt: 0 } } : {};
  return prisma.equipo.findMany({ where, orderBy: { nombre: 'asc' } });
}

export async function obtenerEquipo(id) {
  return prisma.equipo.findUnique({ where: { id } });
}

export async function crearEquipo(data) {
  return prisma.equipo.create({
    data: {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion,
      precioDia: Number(data.precioDia),
      stock: data.stock === undefined ? 0 : Number(data.stock)
    }
  });
}

export async function actualizarEquipo(id, data) {
  const cambios = { ...data };
  if (cambios.nombre !== undefined) cambios.nombre = cambios.nombre.trim();
  if (cambios.precioDia !== undefined) cambios.precioDia = Number(cambios.precioDia);
  if (cambios.stock !== undefined) cambios.stock = Number(cambios.stock);
  return prisma.equipo.update({ where: { id }, data: cambios });
}

export async function eliminarEquipo(id) {
  return prisma.equipo.delete({ where: { id } });
}
