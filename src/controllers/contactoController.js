import * as model from '../models/contactoModelo.js';

export const obtenerContacto = async (req, res) => {
    try {
        const datos = await model.getContacto();
        if (!datos) {
            return res.status(404).json({ error: "No hay datos de contacto" });
        }
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};