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
    const { curp, usuario, contrasena } = req.body;

    const existeCurp = await model.checkCurpExists(curp);
    if (existeCurp) {
      return res.status(400).json({ msg: "La CURP ya se encuentra registrada." });
    }

    const existeUsuario = await model.checkUserExists(usuario); 
    if (existeUsuario) {
      return res.status(400).json({ msg: "El nombre de usuario ya está en uso." });
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

    res.status(500).json({ error: "Error interno del servidor al registrar." });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { curp } = req.body;

    const existeEnOtro = await model.checkCurpExists(curp, id);
    if (existeEnOtro) {
      return res.status(400).json({ msg: "La CURP ingresada ya pertenece a otro paciente." });
    }

    const updated = await model.updatePaciente(id, req.body);

    res.json({ msg: "Datos personales actualizados con éxito", data: updated });

  } catch (error) {
    console.error("Error al actualizar:", error);

    if (error.sqlState === '45000') {
      return res.status(400).json({ msg: error.sqlMessage });
    }

    res.status(500).json({ error: "Error interno al actualizar el paciente." });
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