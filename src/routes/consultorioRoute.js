import { Router } from 'express';
import * as ctrl from '../controllers/consultorioController.js';

const router = Router();

router.get('/', ctrl.getConsultorios);
router.get('/:id', ctrl.getConsultorio);
router.post('/', ctrl.createConsultorio);
router.put('/:id', ctrl.updateConsultorio);
router.delete('/:id', ctrl.deleteConsultorio);

export default router;

