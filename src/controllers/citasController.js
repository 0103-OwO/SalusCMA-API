import * as model from '../models/citasModelo.js';

export const getCitas = async (req, res) => {
  try {
    const data = await model.getAllCitas();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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