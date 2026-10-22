import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as ctrl from '../controllers/equipos.controller.js';
import { validar } from '../middlewares/validar.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', [
  query('disponibles').optional().isBoolean().toBoolean()
], validar, ctrl.listar);

router.get('/:id', [param('id').isInt({ min: 1 })], validar, ctrl.obtener);

router.post('/', requireAuth, requireRole('ADMIN'), [
  body('nombre').isString().trim().notEmpty(),
  body('descripcion').optional().isString(),
  body('precioDia').isInt({ min: 0 }),
  body('stock').optional().isInt({ min: 0 })
], validar, ctrl.crear);

router.put('/:id', requireAuth, requireRole('ADMIN'), [
  param('id').isInt({ min: 1 }),
  body('nombre').optional().isString(),
  body('descripcion').optional().isString(),
  body('precioDia').optional().isInt({ min: 0 }),
  body('stock').optional().isInt({ min: 0 })
], validar, ctrl.actualizar);

router.delete('/:id', requireAuth, requireRole('ADMIN'), [
  param('id').isInt({ min: 1 })
], validar, ctrl.eliminar);

export default router;
