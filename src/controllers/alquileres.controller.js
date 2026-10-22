import * as alquileresService from '../services/alquileres.service.js';

export async function listar(req, res, next) {
  try {
    const alquileres = await alquileresService.listarAlquileres({
      userId: req.user.userId,
      esAdmin: req.user.role === 'ADMIN'
    });
    return res.json(alquileres);
  } catch (error) {
    return next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const alquiler = await alquileresService.obtenerAlquiler(Number(req.params.id), {
      userId: req.user.userId,
      esAdmin: req.user.role === 'ADMIN'
    });
    return res.json(alquiler);
  } catch (error) {
    return next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const alquiler = await alquileresService.crearAlquiler({
      ...req.body,
      usuarioId: req.user.userId
    });
    return res.status(201).json(alquiler);
  } catch (error) {
    return next(error);
  }
}
