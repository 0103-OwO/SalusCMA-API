import { Router } from 'express';
import * as ctrl from '../controllers/citasController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verificarToken, ctrl.obtenerCitas);
router.get('/:id', verificarToken, ctrl.getCita);
router.post('/', verificarToken, ctrl.createCita);
router.put('/:id', verificarToken, ctrl.updateCita);
router.delete('/:id', verificarToken, ctrl.deleteCita);
router.get('/mis-citas', verificarToken, ctrl.getCitasMedico);
export default router;
