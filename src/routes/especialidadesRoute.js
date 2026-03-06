import { Router } from 'express';
import * as ctrl from '../controllers/especialidadesController.js';

const router = Router();

router.get('/', ctrl.getEspecialidades);
router.get('/:id', ctrl.getEspecialidad);
router.post('/', ctrl.createEspecialidad);
router.put('/:id', ctrl.updateEspecialidad);
router.delete('/:id', ctrl.deleteEspecialidad);

export default router;