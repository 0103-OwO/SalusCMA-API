import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/imagenController.js';

const router = Router();

router.get('/', ctrl.mostrarLogo);
router.put('/update-logo', upload.single('logo'), ctrl.actualizarLogo);

export default router;