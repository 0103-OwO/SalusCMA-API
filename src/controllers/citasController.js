import * as model from '../models/citasModelo.js';

export const obtenerCitas = async (req, res) => {
  try {
    await model.actualizarCitasVencidas();

    const data = await model.getAllCitas();
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar citas' });
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

export const registrarCita = async (req, res) => {
  try {
    await model.createCita(req.body);
    res.status(201).json({ message: 'Cita agendada con éxito' });
  } catch (error) {
    console.error("Error SQL:", error.sqlMessage);
    res.status(400).json({ error: error.sqlMessage || 'Error al agendar cita' });
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
    const id_medico = req.usuario.id;

    console.log("Buscando citas para el médico con ID:", id_medico);

    const citas = await model.getCitasByMedico(id_medico);

    res.json(citas || []);
  } catch (error) {
    console.error("Error en getCitasMedico:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};