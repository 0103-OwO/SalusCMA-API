
import { Router } from 'express';
import * as ctrl from '../controllers/trabajadoresController.js';

const router = Router();

router.get('/', ctrl.getTrabajadores);
router.get('/:id', ctrl.getTrabajador);
router.post('/', ctrl.createTrabajador);
router.put('/:id', ctrl.updateTrabajador);
router.delete('/:id', ctrl.deleteTrabajador);

export default router;