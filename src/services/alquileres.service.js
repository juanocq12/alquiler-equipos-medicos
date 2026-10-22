import prisma from '../utils/prisma.js';
import { badRequest, conflict, notFound } from '../utils/errors.js';

const alquilerInclude = {
  usuario: {
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      createdAt: true
    }
  },
  items: { include: { equipo: true } }
};

export async function listarAlquileres({ userId, esAdmin }) {
  return prisma.alquiler.findMany({
    where: esAdmin ? {} : { usuarioId: userId },
    include: alquilerInclude,
    orderBy: { createdAt: 'desc' }
  });
}

export async function obtenerAlquiler(id, { userId, esAdmin }) {
  const alquiler = await prisma.alquiler.findUnique({
    where: { id },
    include: alquilerInclude
  });
  if (!alquiler || (!esAdmin && alquiler.usuarioId !== userId)) {
    throw notFound('Alquiler no encontrado');
  }
  return alquiler;
}

export async function crearAlquiler({ usuarioId, fechaInicio, fechaFin, items }) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (!Number.isFinite(inicio.getTime()) || !Number.isFinite(fin.getTime()) || fin <= inicio) {
    throw badRequest('El rango de fechas del alquiler no es válido');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw badRequest('Debe incluir al menos un item');
  }

  const lineas = items.map((item) => ({
    equipoId: Number(item.equipoId),
    cantidad: Number(item.cantidad)
  }));
  if (lineas.some((item) =>
    !Number.isInteger(item.equipoId) || item.equipoId < 1 ||
    !Number.isInteger(item.cantidad) || item.cantidad < 1
  )) {
    throw badRequest('Los equipos y cantidades deben ser válidos');
  }

  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.findUnique({ where: { id: usuarioId }, select: { id: true } });
    if (!usuario) throw notFound('Usuario no encontrado');

    const ids = [...new Set(lineas.map((item) => item.equipoId))];
    const equipos = await tx.equipo.findMany({ where: { id: { in: ids } } });
    if (equipos.length !== ids.length) throw notFound('Equipo no encontrado');

    const equiposPorId = new Map(equipos.map((equipo) => [equipo.id, equipo]));
    const cantidades = new Map();
    for (const item of lineas) {
      cantidades.set(item.equipoId, (cantidades.get(item.equipoId) || 0) + item.cantidad);
    }

    for (const [equipoId, cantidad] of cantidades) {
      const equipo = equiposPorId.get(equipoId);
      if (equipo.stock < cantidad) {
        throw conflict(`Stock insuficiente para ${equipo.nombre}`);
      }
    }

    const dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    const total = lineas.reduce((suma, item) => {
      return suma + equiposPorId.get(item.equipoId).precioDia * item.cantidad * dias;
    }, 0);

    for (const [equipoId, cantidad] of cantidades) {
      const actualizacion = await tx.equipo.updateMany({
        where: { id: equipoId, stock: { gte: cantidad } },
        data: { stock: { decrement: cantidad } }
      });
      if (actualizacion.count !== 1) {
        throw conflict(`Stock insuficiente para ${equiposPorId.get(equipoId).nombre}`);
      }
    }

    const alquiler = await tx.alquiler.create({
      data: {
        usuarioId,
        fechaInicio: inicio,
        fechaFin: fin,
        total,
        estado: 'PENDIENTE'
      }
    });

    await tx.alquilerItem.createMany({
      data: lineas.map((item) => ({
        alquilerId: alquiler.id,
        equipoId: item.equipoId,
        cantidad: item.cantidad,
        precioDia: equiposPorId.get(item.equipoId).precioDia
      }))
    });

    return tx.alquiler.findUnique({
      where: { id: alquiler.id },
      include: alquilerInclude
    });
  });
}
