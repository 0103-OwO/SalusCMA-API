import express from 'express';
import * as historialCtrl from '../controllers/historialController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mis-historiales', historialCtrl.getHistorialesMedico);
router.get('/', historialCtrl.getTodosLosHistoriales);
router.get('/:id', historialCtrl.getHistorial);
router.post('/registrar', historialCtrl.crearHistorialDesdeCita);
router.put('/:id', historialCtrl.actualizarHistorial);
router.delete('/:id', historialCtrl.eliminarHistorial);

export default router;