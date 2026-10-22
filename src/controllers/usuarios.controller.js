import * as usuariosService from '../services/usuarios.service.js';
import { notFound } from '../utils/errors.js';

export async function listar(req, res, next) {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    return res.json(usuarios);
  } catch (error) {
    return next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const usuario = await usuariosService.obtenerUsuario(Number(req.params.id));
    if (!usuario) throw notFound('Usuario no encontrado');
    return res.json(usuario);
  } catch (error) {
    return next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const usuario = await usuariosService.crearUsuario(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    return next(error);
  }
}
