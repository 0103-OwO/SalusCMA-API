import { Router } from 'express';
import * as ctrl from '../controllers/citasController.js';

const router = Router();

router.get('/', ctrl.getCitas);
router.get('/:id', ctrl.getCita);
router.post('/', ctrl.createCita);
router.put('/:id', ctrl.updateCita);
router.delete('/:id', ctrl.deleteCita);

export default router;
