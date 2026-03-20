import express from 'express';
import * as obtenerHistorial from '../controllers/historialController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',verificarToken, obtenerHistorial.obtenerHistorial);

export default router;