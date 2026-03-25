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

    if (await model.checkCurpExists(curp)) {
      return res.status(400).json({ msg: "La CURP ya existe." });
    }

    if (await model.checkUserExists(usuario)) {
      return res.status(400).json({ msg: "El nombre de usuario ya existe." });
    }

    if (await model.checkEmailExists(req.body.correo)) {
      return res.status(400).json({ msg: "El correo electrónico ya existe." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(contrasena, salt);

    await model.createPacienteCompleto({
      ...req.body,
      contrasena: hashContrasena
    });

    res.status(201).json({ msg: "Paciente y usuario registrados con éxito." });

  } catch (error) {
    console.error("Error en el registro:", error);

    if (error.errno === 1644 || error.sqlState === '45000') {
      return res.status(400).json({ msg: error.sqlMessage });
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
      return res.status(400).json({
        msg: "La CURP ya existe."
      });
    }

    const updated = await model.updatePaciente(id, req.body);

    res.json({
      success: true,
      msg: "Datos personales actualizados con éxito",
      data: updated
    });

  } catch (error) {
    console.error("Error al actualizar:", error);

    if (error.errno === 1644 || error.sqlState === '45000') {
      return res.status(400).json({ msg: error.sqlMessage });
    }

    if (error.errno === 1062) {
      return res.status(400).json({ msg: "Los datos ingresados ya están en uso por otro registro." });
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

export const obtenerPerfilPaciente = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const query = `
            SELECT p.*, u.email, u.usuario, u.id_usuario_cliente
            FROM usuarios_clientes u
            INNER JOIN pacientes p ON u.id_paciente = p.id_pacientes
            WHERE u.id_usuario_cliente = ?`;

    const [rows] = await db.query(query, [idUsuario]);

    if (rows.length === 0) {
      console.log("No se encontro relacion para el ID de usuario:", idUsuario);
      return res.status(404).json({ msg: "No se encontraron datos vinculados." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error exacto en el servidor:", error);
    res.status(500).json({ msg: "Error interno al obtener perfil." });
  }
};

export const updatePacientePerfil = async (req, res) => {
  const { id } = req.params;

  try {
    // Ejecutar la actualización (usando el modelo que separa las tablas)
    await model.updatePacienteYUsuario(id, req.body);

    res.json({
      success: true,
      msg: "Perfil actualizado correctamente."
    });

  } catch (error) {
    console.error("DEBUG - Error en updatePaciente:", error);

    // --- EXCEPCIÓN 1: Entradas Duplicadas (MySQL Error 1062) ---
    if (error.errno === 1062) {
      const campoDuplicado = error.sqlMessage;

      if (campoDuplicado.includes('curp')) {
        return res.status(400).json({ msg: "La CURP ya está registrada por otro paciente." });
      }
      if (campoDuplicado.includes('email')) {
        return res.status(400).json({ msg: "Este correo electrónico ya está en uso." });
      }
      if (campoDuplicado.includes('usuario')) {
        return res.status(400).json({ msg: "El nombre de usuario no está disponible." });
      }

      return res.status(400).json({ msg: "Uno de los datos ya existe en el sistema." });
    }

    // --- EXCEPCIÓN 2: Error de Columna o Sintaxis (MySQL Error 1054 / 1146) ---
    if (error.errno === 1054 || error.errno === 1146) {
      console.error("CRÍTICO: Error de estructura en la DB:", error.sqlMessage);
      return res.status(500).json({
        msg: "Error técnico: La estructura de la base de datos no coincide con el modelo."
      });
    }

    // --- EXCEPCIÓN 3: Errores de Validación de Triggers (MySQL Error 1644) ---
    if (error.errno === 1644 || error.sqlState === '45000') {
      return res.status(400).json({ msg: error.sqlMessage });
    }

    // --- EXCEPCIÓN GENÉRICA ---
    res.status(500).json({
      error: "Error interno del servidor",
      detalles: error.message
    });
  }
};