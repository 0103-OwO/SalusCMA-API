import { Router } from 'express';
import { upload } from '../config/multer.js';
import * as ctrl from '../controllers/mvvhController.js';

const router = Router();

router.get('/', ctrl.obtenerTodo); 

router.put('/update', (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'La imagen es muy pesada. El máximo es 5MB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, ctrl.actualizarSeccionInstitucional);

export default router;