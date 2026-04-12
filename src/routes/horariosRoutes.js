import { Router } from 'express';
import * as ctrl from '../controllers/horariosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/mis-horarios', verificarToken, ctrl.getHorarioMedico);
router.get('/activas', verificarToken, ctrl.obtenerAsignacionesActivas);
router.get('/', verificarToken, ctrl.obtenerHorarios);
router.get('/:id', verificarToken, ctrl.getHorario);
router.post('/', verificarToken, ctrl.createHorario);
router.put('/:id', verificarToken, ctrl.updateHorario);
router.delete('/:id', verificarToken, ctrl.deleteHorario);


export default router;