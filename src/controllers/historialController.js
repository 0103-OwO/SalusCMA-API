import * as model from '../models/historialModel.js';

export const crearHistorialDesdeCita = async (req, res) => {
    try {
        await model.registrarHistorialProceso(req.body);
        res.status(201).json({ 
            success: true, 
            message: "Historial registrado y cita finalizada correctamente" 
        });
    } catch (error) {
        console.error("Error al ejecutar procedimiento:", error);
        res.status(500).json({ error: error.message || "Error al procesar el historial" });
    }
};

export const getHistorialesMedico = async (req, res) => {
    try {
        const id_medico = req.usuario.id; 
        const data = await model.getHistorialesByMedico(id_medico);
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historiales" });
    }
};

export const eliminarHistorial = async (req, res) => {
    try {
        const result = await model.deleteHistorial(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistorial = async (req, res) => {
    try {
        const data = await model.getHistorialById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Historial no encontrado" });
        }
        res.json(data);
    } catch (error) {
        console.error("Error en getHistorial:", error);
        res.status(500).json({ error: error.message });
    }
};

export const actualizarHistorial = async (req, res) => {
    try {
        const id = req.params.id;
        const actualizado = await model.updateHistorial(id, req.body);
        res.json({ success: true, data: actualizado });
    } catch (error) {
        console.error("Error al actualizar historial:", error);
        res.status(500).json({ error: "Error interno al actualizar" });
    }
};