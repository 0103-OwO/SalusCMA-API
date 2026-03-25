import { Router } from 'express';
import * as ctrl from '../controllers/pacientesController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/perfil', verificarToken, ctrl.obtenerPerfilPaciente);

router.put('/:id', verificarToken, ctrl.updatePacientePerfil);

router.get('/:id',verificarToken, ctrl.getPacientes);
router.get('/:id',verificarToken, ctrl.getPaciente);

router.post('/',verificarToken, ctrl.createPaciente);
router.put('/:id',verificarToken, ctrl.updatePaciente);
router.delete('/:id',verificarToken, ctrl.deletePaciente);

export default router;