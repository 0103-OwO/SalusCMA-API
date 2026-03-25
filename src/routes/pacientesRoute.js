import { Router } from 'express';
import * as ctrl from '../controllers/pacientesController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/perfil',ctrl.obtenerPerfilPaciente);

router.put('/actualizar-perfil', verificarToken, ctrl.updatePacientePerfil);


router.get('/:id',verificarToken, ctrl.getPaciente);


router.put('/:id',verificarToken, ctrl.updatePaciente);
router.delete('/:id',verificarToken, ctrl.deletePaciente);

router.post('/',verificarToken, ctrl.createPaciente);
router.get('/',verificarToken, ctrl.getPacientes);

export default router;