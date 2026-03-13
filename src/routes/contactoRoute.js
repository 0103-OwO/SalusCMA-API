import express from 'express';
import * as controller from '../controllers/contactoController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', controller.obtenerContacto);
router.put('/update', verificarToken, controller.actualizarContacto);

export default router;