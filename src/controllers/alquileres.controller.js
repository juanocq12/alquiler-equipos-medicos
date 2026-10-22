import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function listar(req, res, next) {
  try {
    const alquileres = await prisma.alquiler.findMany({
      include: { usuario: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alquileres);
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const alquiler = await prisma.alquiler.findUnique({
      where: { id: Number(req.params.id) },
      include: { usuario: true, items: true }
    });

    if (!alquiler) {
      return res.status(404).json({ error: 'Alquiler no encontrado' });
    }

    res.json(alquiler);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { usuarioId, fechaInicio, fechaFin, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un item' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({ where: { id: Number(usuarioId) } });
      if (!usuario) {
        throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
      }

      const equipoIds = items.map((item) => item.equipoId);
      const equipos = await tx.equipo.findMany({ where: { id: { in: equipoIds } } });
      if (equipos.length !== equipoIds.length) {
        throw Object.assign(new Error('Equipo no encontrado'), { status: 404 });
      }

      const equiposMap = new Map(equipos.map((eq) => [eq.id, eq]));
      let total = 0;

      for (const item of items) {
        const equipo = equiposMap.get(item.equipoId);
        const cantidad = Number(item.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
          throw Object.assign(new Error('Cantidad inválida'), { status: 400 });
        }
        if (!equipo || equipo.stock < cantidad) {
          throw Object.assign(new Error(`Stock insuficiente para ${equipo?.nombre || 'equipo'}`), { status: 409 });
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
        const equipo = equiposMap.get(item.equipoId);
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
          data: { stock: { decrement: Number(item.cantidad) } }
        });
      }

      return tx.alquiler.findUnique({
        where: { id: alquiler.id },
        include: { usuario: true, items: true }
      });
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
}
