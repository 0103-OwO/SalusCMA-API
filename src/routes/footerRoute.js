import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/footerController.js';

const router = Router();

router.get('/', ctrl.obtenerFooter);

const footerUploads = upload.fields([
    { name: 'img_facebook', maxCount: 1 },
    { name: 'img_instagram', maxCount: 1 },
    { name: 'img_x', maxCount: 1 }
]);

router.put('/update', footerUploads, ctrl.actualizarFooter);

export default router;