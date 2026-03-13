import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/mvvhController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', ctrl.obtenerTodo); 

router.put('/update', verificarToken, upload.single('imagen'), ctrl.actualizarSeccionInstitucional);

export default router;