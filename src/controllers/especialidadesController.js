import * as model from '../models/especialidadesModel.js';

export const getEspecialidades = async (req, res) => {
  try {
    const data = await model.getAllEspecialidades();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEspecialidad = async (req, res) => {
  try {
    const data = await model.getEspecialidadById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrada" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEspecialidad = async (req, res) => {
  try {
    if (!req.body.especialidad)
      return res.status(400).json({ msg: "Falta nombre" });

    const nueva = await model.createEspecialidad(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEspecialidad = async (req, res) => {
  try {
    const updated = await model.updateEspecialidad(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEspecialidad = async (req, res) => {
  try {
    const result = await model.deleteEspecialidad(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};