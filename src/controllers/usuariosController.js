import * as usuarioModel from '../models/usuariosModel.js';
import bcrypt from 'bcryptjs';

export const listar = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const obtenerUno = async (req, res) => {
  try {
    const usuario = await usuarioModel.getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crear = async (req, res) => {
  try {
    const { usuario, contrasena, id_rol, id_trabajador } = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const datosNuevo = {
      usuario,
      contrasena: hash,
      id_rol,
      id_trabajador
    };

    // El Trigger de la DB validará duplicados aquí
    const nuevo = await usuarioModel.createUsuario(datosNuevo);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      id: nuevo.id_usuario
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Error al registrar usuario'
    });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  let datosActualizar = { ...req.body };

  try {
    // Si viene una contraseña nueva, la encriptamos
    if (datosActualizar.contrasena && datosActualizar.contrasena.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      datosActualizar.contrasena = await bcrypt.hash(datosActualizar.contrasena, salt);
    } else {
      // Si viene vacía, la eliminamos del objeto para que no se sobreescriba en la DB
      delete datosActualizar.contrasena;
    }

    await usuarioModel.updateUsuario(id, datosActualizar);

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Error al actualizar usuario'
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    await usuarioModel.deleteUsuario(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};