import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/logoController.js';

const router = Router();

router.get('/', ctrl.mostrarLogo);
router.put('/:id', upload.single('logo'), ctrl.actualizarLogo);

export default router;