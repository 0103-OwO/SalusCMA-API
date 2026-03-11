import express from 'express';
import * as controller from '../controllers/contactoController.js';

const router = express.Router();
router.get('/', controller.obtenerContacto);

export default router;