import * as model from '../models/citasModelo.js';

export const obtenerCitas = async (req, res) => {
  try {
    const data = await model.getAllCitas();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No se encontraron citas' });
    }
    res.json(data);
  } catch (error) {
    console.error("Error en obtener Citas:", error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

export const getCita = async (req, res) => {
  try {
    const data = await model.getCitaById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrada" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCita = async (req, res) => {
  try {
    const nueva = await model.createCita(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCita = async (req, res) => {
  try {
    const updated = await model.updateCita(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCita = async (req, res) => {
  try {
    const result = await model.deleteCita(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCitasMedico = async (req, res) => {
  try {
    const id_trabajador_token = req.user.id;

    const citas = await model.getCitasByMedico(id_trabajador_token);

    res.status(200).json(citas);
  } catch (error) {
    console.error("ERROR EN SQL/CONTROLLER:", error);
    res.status(500).json({ error: "Error en la consulta de base de datos" });
  }
};