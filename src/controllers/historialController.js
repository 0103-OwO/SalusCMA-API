import * as model from '../models/historialModel.js';

export const obtenerHistorial = async (req, res) => {
    try {
        const data = await model.getAllHistorial();
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No hay registros en el historial' });
        }
        res.json(data);
    } catch (error) {
        console.error("Error en obtenerHistorial:", error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
};