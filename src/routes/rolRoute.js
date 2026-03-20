import { Router } from 'express';
import * as roles from '../controllers/rolController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/',roles.obtenerRol);

export default router;