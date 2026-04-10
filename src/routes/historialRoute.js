import express from 'express';
import * as historialCtrl from '../controllers/historialController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mis-historiales', verificarToken, historialCtrl.getHistorialesMedico);
router.get('/', verificarToken, historialCtrl.getTodosLosHistoriales);
router.get('/:id', verificarToken, historialCtrl.getHistorial);
router.post('/registrar', verificarToken, historialCtrl.crearHistorialDesdeCita);
router.put('/:id', verificarToken, historialCtrl.actualizarHistorial);
router.delete('/:id', verificarToken, historialCtrl.eliminarHistorial);

export default router;