import * as model from '../models/consultorioModel.js';

export const getConsultorios = async (req, res) => {
  try {
    const data = await model.getAllConsultorios();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConsultorio = async (req, res) => {
  try {
    const data = await model.getConsultorioById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createConsultorio = async (req, res) => {
  try {
    const nuevo = await model.createConsultorio(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConsultorio = async (req, res) => {
  try {
    const updated = await model.updateConsultorio(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteConsultorio = async (req, res) => {
  try {
    const result = await model.deleteConsultorio(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

