import * as equiposService from '../services/equipos.service.js';
import { notFound } from '../utils/errors.js';

export async function listar(req, res, next) {
  try {
    const equipos = await equiposService.listarEquipos({
      disponibles: req.query.disponibles === true
    });
    return res.json(equipos);
  } catch (error) {
    return next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const equipo = await equiposService.obtenerEquipo(Number(req.params.id));
    if (!equipo) throw notFound('Equipo no encontrado');
    return res.json(equipo);
  } catch (error) {
    return next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const equipo = await equiposService.crearEquipo(req.body);
    return res.status(201).json(equipo);
  } catch (error) {
    return next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const equipo = await equiposService.actualizarEquipo(Number(req.params.id), req.body);
    return res.json(equipo);
  } catch (error) {
    return next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    await equiposService.eliminarEquipo(Number(req.params.id));
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
