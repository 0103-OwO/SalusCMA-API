import { Router } from 'express';
import * as ctrl from '../controllers/pacientesController.js';

const router = Router();

router.get('/', ctrl.getPacientes);
router.get('/:id', ctrl.getPaciente);
router.post('/', ctrl.createPaciente);
router.put('/:id', ctrl.updatePaciente);
router.delete('/:id', ctrl.deletePaciente);

export default router;