import { Router } from 'express';
import * as ctrl from '../controllers/consultorioController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', ctrl.obtenerTodos);
router.get('/:id', ctrl.obtenerPorId);

router.post('/',verificarToken ,ctrl.crear);
router.put('/:id', verificarToken, ctrl.actualizar);
router.delete('/:id', verificarToken, ctrl.eliminar);

export default router;

