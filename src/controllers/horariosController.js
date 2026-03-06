import * as model from '../models/horariosModel.js';

export const getHorarios = async (req, res) => {
  try {
    const data = await model.getAllHorarios();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHorario = async (req, res) => {
  try {
    const data = await model.getHorarioById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createHorario = async (req, res) => {
  try {
    const nuevo = await model.createHorario(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHorario = async (req, res) => {
  try {
    const updated = await model.updateHorario(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHorario = async (req, res) => {
  try {
    const result = await model.deleteHorario(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

