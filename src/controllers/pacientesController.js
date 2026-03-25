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

    // 1. Validaciones manuales
    const existeCurp = await model.checkCurpExists(curp);
    if (existeCurp) {
      return res.status(400).json({ msg: "La CURP ya se encuentra registrada." });
    }

    const existeUsuario = await model.checkUserExists(usuario);
    if (existeUsuario) {
      return res.status(400).json({ msg: "El nombre de usuario ya está en uso." });
    }

    // 2. Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    // 3. Intento de inserción
    await model.createPacienteCompleto({
      ...req.body,
      contrasena: hashContrasena
    });

    res.status(201).json({ msg: "Paciente y usuario registrados con éxito." });

  } catch (error) {
    // --- SECCIÓN DE LOGS CRÍTICOS ---
    console.error("********** ERROR DE REGISTRO DETECTADO **********");
    console.error("Código Error (code):", error.code);     // Ej: ER_CANT_AGGREGATE_2COLLATIONS
    console.error("Número Error (errno):", error.errno);   // Ej: 1267
    console.error("Estado SQL (sqlState):", error.sqlState);
    console.error("Mensaje MySQL:", error.sqlMessage);     // El texto real del error
    console.error("Stack Trace:", error.stack);            // Dónde falló el archivo JS
    console.error("*************************************************");

    // Respuesta inteligente basada en el error capturado
    if (error.sqlState === '45000' || error.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(400).json({
        success: false,
        msg: error.sqlMessage
      });
    }

    // Si el error es de Collation (el que tenías antes)
    if (error.code === 'ER_CANT_AGGREGATE_2COLLATIONS') {
      return res.status(500).json({
        error: "Conflicto de colaciones en la DB",
        detalle: "Asegúrate de que 'pacientes' y 'usuarios_clientes' usen utf8mb4_unicode_ci"
      });
    }

    // Respuesta genérica 500 pero con el detalle técnico para que lo veas en el navegador
    res.status(500).json({
      error: "Error interno del servidor",
      debug: error.sqlMessage || error.message
    });
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