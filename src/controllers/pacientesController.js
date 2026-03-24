import * as model from '../models/pacientesModel.js';
import bcrypt from 'bcryptjs';
export const getPacientes = async (req, res) => {
  try {
    const data = await model.getAllPacientes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaciente = async (req, res) => {
  try {
    const data = await model.getPacienteById(req.params.id);
    if (!data) return res.status(404).json({ msg: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaciente = async (req, res) => {
  try {
    const { curp, contrasena, usuario } = req.body;

    const existe = await model.checkCurpExists(curp);
    if (existe) {
      return res.status(400).json({ msg: "La CURP ya se encuentra registrada." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    await model.createPacienteCompleto({
      ...req.body,
      contrasena: hashContrasena
    });

    res.status(201).json({ msg: "Paciente y usuario registrados con éxito." });

  } catch (error) {
    console.error("Fallo en el registro:", error);

    if (error.sqlState === '45000' || error.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(400).json({ msg: error.sqlMessage || error.message });
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ msg: "Error: Ya existe un registro con esos datos (CURP o Usuario)." });
    }

    res.status(500).json({ error: "Error interno del servidor al registrar." });
  }
};
export const updatePaciente = async (req, res) => {
  try {
    const updated = await model.updatePaciente(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const result = await model.deletePaciente(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};