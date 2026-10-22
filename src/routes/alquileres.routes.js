import { Router } from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/alquileres.controller.js';
import { validar } from '../middlewares/validar.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, ctrl.listar);
router.get('/:id', requireAuth, [param('id').isInt({ min: 1 })], validar, ctrl.obtener);

router.post('/', requireAuth, [
  body('usuarioId').isInt({ min: 1 }),
  body('fechaInicio').isISO8601(),
  body('fechaFin').isISO8601(),
  body('items').isArray({ min: 1 })
], validar, ctrl.crear);

export default router;
