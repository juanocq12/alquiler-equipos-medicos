import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const resultado = await authService.registerUser(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const resultado = await authService.loginUser(req.body);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const usuario = await authService.obtenerUsuarioAutenticado(req.user.userId);
    return res.json(usuario);
  } catch (error) {
    return next(error);
  }
}
