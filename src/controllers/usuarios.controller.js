import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function listar(req, res, next) {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { nombre, email, password, rol = 'CLIENTE' } = req.body;
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash: password,
        rol
      }
    });

    const { passwordHash, ...salida } = usuario;
    res.status(201).json(salida);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    next(error);
  }
}
