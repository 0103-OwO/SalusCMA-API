import * as model from '../models/rolModel.js';

export const obtenerRol = async (req, res) => {
    try {
        const data = await model.getAllRoles(); 
        
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        
        res.json(data);
    } catch (error) {
        console.error("Error en obtenerRol:", error);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
};
