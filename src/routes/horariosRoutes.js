import { Router } from 'express';
import * as ctrl from '../controllers/horariosController.js';

const router = Router();

router.get('/', ctrl.getHorarios);
router.get('/:id', ctrl.getHorario);
router.post('/', ctrl.createHorario);
router.put('/:id', ctrl.updateHorario);
router.delete('/:id', ctrl.deleteHorario);

export default router;