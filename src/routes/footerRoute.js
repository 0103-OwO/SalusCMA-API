import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/footerController.js';
import { verificarToken } from '../middleware/authMiddleware.js'; 

const router = Router();

router.get('/', ctrl.obtenerFooter);

const footerUploads = upload.fields([
    { name: 'img_facebook', maxCount: 1 },
    { name: 'img_instagram', maxCount: 1 },
    { name: 'img_x', maxCount: 1 }
]);

router.put('/update', verificarToken, footerUploads, ctrl.actualizarFooter);

export default router;