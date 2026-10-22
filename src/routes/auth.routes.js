import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { validar } from '../middlewares/validar.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', [
  body('nombre').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
], validar, authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().notEmpty()
], validar, authController.login);

router.get('/me', requireAuth, authController.me);

export default router;
