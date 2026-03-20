import * as model from '../models/rolModel.js';

export const obtenerRol = async (req, res) => {
    try {
        const data = await model.getRol();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles' });
    }
};