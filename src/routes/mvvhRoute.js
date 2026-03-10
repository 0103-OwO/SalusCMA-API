import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/mvvhController.js';

const router = Router();

router.get('/', ctrl.obtenerTodo); 

router.put('/update', upload.single('imagen'), ctrl.actualizarSeccionInstitucional);

export default router;