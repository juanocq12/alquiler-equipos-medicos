import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function listarAlquileres() {
  return prisma.alquiler.findMany({
    include: {
      usuario: true,
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function obtenerAlquiler(id) {
  return prisma.alquiler.findUnique({
    where: { id },
    include: { usuario: true, items: true }
  });
}

export async function crearAlquiler(data) {
  const { usuarioId, fechaInicio, fechaFin, items } = data;

  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    const equipos = await tx.equipo.findMany({ where: { id: { in: items.map((item) => item.equipoId) } } });
    if (equipos.length !== items.length) {
      const error = new Error('Equipo no encontrado');
      error.status = 404;
      throw error;
    }

    const equipoMap = new Map(equipos.map((equipo) => [equipo.id, equipo]));
    let total = 0;

    for (const item of items) {
      const equipo = equipoMap.get(item.equipoId);
      const cantidad = Number(item.cantidad);

      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        const error = new Error('Cantidad inválida');
        error.status = 400;
        throw error;
      }

      if (!equipo || equipo.stock < cantidad) {
        const error = new Error(`Stock insuficiente para ${equipo ? equipo.nombre : 'equipo'}`);
        error.status = 409;
        throw error;
      }

      const dias = Math.max(1, Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)));
      total += equipo.precioDia * cantidad * dias;
    }

    const alquiler = await tx.alquiler.create({
      data: {
        usuarioId: Number(usuarioId),
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        total,
        estado: 'PENDIENTE'
      }
    });

    for (const item of items) {
      const equipo = equipoMap.get(item.equipoId);
      await tx.alquilerItem.create({
        data: {
          alquilerId: alquiler.id,
          equipoId: equipo.id,
          cantidad: Number(item.cantidad),
          precioDia: equipo.precioDia
        }
      });

      await tx.equipo.update({
        where: { id: equipo.id },
        data: {
          stock: { decrement: Number(item.cantidad) }
        }
      });
    }

    return tx.alquiler.findUnique({
      where: { id: alquiler.id },
      include: { usuario: true, items: true }
    });
  });
}
