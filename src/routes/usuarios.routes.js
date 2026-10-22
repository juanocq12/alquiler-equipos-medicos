import { Router } from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/usuarios.controller.js';
import { validar } from '../middlewares/validar.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), ctrl.listar);
router.get('/:id', requireAuth, requireRole('ADMIN'), [param('id').isInt({ min: 1 })], validar, ctrl.obtener);

router.post('/', requireAuth, requireRole('ADMIN'), [
  body('nombre').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('rol').optional().isIn(['CLIENTE', 'ADMIN'])
], validar, ctrl.crear);

export default router;
