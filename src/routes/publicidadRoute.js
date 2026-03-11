import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/publicidadController.js';

const router = Router();

const uploadBanners = upload.fields([
    { name: 'img_uno', maxCount: 1 },
    { name: 'img_dos', maxCount: 1 },
    { name: 'img_tres', maxCount: 1 }
]);

router.get('/', ctrl.obtenerPublicidad);
router.put('/update', uploadBanners, ctrl.actualizarPublicidad);

export default router;