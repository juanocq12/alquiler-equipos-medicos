import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function listar(req, res, next) {
  try {
    const equipos = await prisma.equipo.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(equipos);
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const equipo = await prisma.equipo.findUnique({ where: { id: Number(req.params.id) } });
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.json(equipo);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const equipo = await prisma.equipo.create({
      data: {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precioDia: Number(req.body.precioDia),
        stock: Number(req.body.stock || 0)
      }
    });
    res.status(201).json(equipo);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un equipo con ese nombre' });
    }
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const equipo = await prisma.equipo.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(equipo);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    await prisma.equipo.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    next(error);
  }
}
