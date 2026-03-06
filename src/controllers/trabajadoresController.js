import * as model from '../models/trabajadoresModel.js';

export const getTrabajadores = async (req, res) => {
  try {
    const data = await model.getAllTrabajadores();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrabajador = async (req, res) => {
  try {
    const data = await model.getTrabajadorById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTrabajador = async (req, res) => {
  try {
    const nuevo = await model.createTrabajador(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTrabajador = async (req, res) => {
  try {
    const updated = await model.updateTrabajador(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTrabajador = async (req, res) => {
  try {
    const result = await model.deleteTrabajador(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
