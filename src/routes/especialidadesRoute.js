import express from 'express';
import * as especialidadController from '../controllers/especialidadesController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', especialidadController.obtenerTodas);

// Crear, Editar y Borrar requiere TOKEN (Solo personal autorizado es decir admin)
router.post('/', verificarToken, especialidadController.crear);
router.put('/:id', verificarToken, especialidadController.actualizar);
router.delete('/:id', verificarToken, especialidadController.eliminar);

export default router;