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
    const idPaciente = req.usuario.id_referencia;

    if (!idPaciente) {
      return res.status(404).json({ msg: "No tienes un paciente vinculado a esta cuenta." });
    }

    const query = `
            SELECT p.*, u.email, u.usuario
            FROM pacientes p
            INNER JOIN usuarios_clientes u ON u.id_paciente = p.id_pacientes
            WHERE p.id_pacientes = ?`;

    const [rows] = await db.query(query, [idPaciente]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Datos no encontrados." });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ msg: "Error al cargar el perfil." });
  }
};

export const updatePacientePerfil = async (req, res) => {
  const idPaciente = req.usuario.id_referencia;
  const { curp, contrasena } = req.body;

  try {
    if (!idPaciente) {
      return res.status(400).json({ msg: "Sesión no válida para paciente." });
    }

    const curpExiste = await model.checkCurpExists(curp, idPaciente);
    if (curpExiste) {
      return res.status(400).json({ msg: "La CURP ya pertenece a otro registro." });
    }

    const datosUpdate = { ...req.body };

    if (contrasena && contrasena.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      datosUpdate.contrasena = await bcrypt.hash(contrasena, salt);
    } else {
      delete datosUpdate.contrasena;
    }

    await model.updatePacienteYUsuario(idPaciente, datosUpdate);

    res.json({
      success: true,
      msg: "Perfil actualizado correctamente."
    });

  } catch (error) {
    if (error.errno === 1062) {
      const msg = error.sqlMessage.toLowerCase();
      if (msg.includes('email')) return res.status(400).json({ msg: "Correo duplicado." });
      if (msg.includes('usuario')) return res.status(400).json({ msg: "Usuario duplicado." });
    }

    if (error.errno === 1644 || error.sqlState === '45000') {
      return res.status(400).json({ msg: error.sqlMessage });
    }

    res.status(500).json({ msg: "Error en la actualización." });
  }
};