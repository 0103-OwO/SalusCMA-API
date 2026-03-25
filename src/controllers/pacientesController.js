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
      return res.status(400).json({ msg: "La CURP ya se encuentra registrada." });
    }

    if (await model.checkUserExists(usuario)) {
      return res.status(400).json({ msg: "El nombre de usuario ya existe." });
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
    console.log("=== DEBUG: Iniciando obtenerPerfilPaciente ===");
    
    try {
        // 1. Verificar si el middleware inyectó el usuario
        if (!req.usuario) {
            console.error("❌ ERROR: req.usuario es undefined. Revisa el middleware verificarToken.");
            return res.status(401).json({ msg: "Token no válido o no proporcionado" });
        }

        const id_usuario_cliente = req.usuario.id;
        console.log(`🔍 Buscando perfil para id_usuario_cliente: ${id_usuario_cliente}`);

        // 2. Llamada al modelo
        const paciente = await model.getPacienteFullProfile(id_usuario_cliente);

        // 3. Verificar si el modelo retornó algo
        if (!paciente) {
            console.warn(`⚠️ ADVERTENCIA: No se encontró registro en la DB para el ID: ${id_usuario_cliente}`);
            return res.status(404).json({ 
                msg: "Perfil no encontrado",
                debug_id: id_usuario_cliente 
            });
        }

        console.log("✅ Perfil encontrado exitosamente:", paciente.nombre);
        res.json(paciente);

    } catch (error) {
        // 4. Capturar el error exacto de SQL o JS
        console.error("████████ ERROR CRÍTICO EN PERFIL ████████");
        console.error("Mensaje:", error.message);
        console.error("Stack:", error.stack);
        
        res.status(500).json({ 
            error: "Error interno al obtener perfil",
            detalles: error.message 
        });
    } finally {
        console.log("=== DEBUG: Fin de la petición ===");
    }
};