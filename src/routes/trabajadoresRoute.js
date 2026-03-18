import { Router } from 'express';
import * as trabajadores from '../controllers/trabajadoresController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', trabajadores.listar);
router.get('/:id', trabajadores.obtenerUno);

router.post('/',verificarToken,upload.single('foto'), trabajadores.crear);
router.put('/:id',verificarToken, upload.single('foto'), trabajadores.actualizar);
router.delete('/:id', verificarToken, trabajadores.eliminar);

export default router;