import { Router } from 'express';
import * as usuarios from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', usuarios.listar);
router.get('/:id', usuarios.obtenerUno);

router.post('/',verificarToken, usuarios.crear);
router.put('/:id',verificarToken, usuarios.actualizar);
router.delete('/:id', verificarToken, usuarios.eliminar);

export default router;