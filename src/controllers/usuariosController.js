import * as usuarioModel from '../models/usuariosModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emailRecuperacion } from '../services/mailer.service.js';

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

export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;

    //Verificar si el usuario existe
    const usuario = await usuarioModel.buscarUsuarioPorCorreo(correo);
    if (!usuario) {
      return res.status(404).json({ success: false, error: 'El correo no está registrado' });
    }

    //Crear un Token temporal para la recuperación
    const secret = process.env.JWT_SECRET + usuario.password;

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      secret,
      { expiresIn: '15m' }
    );

    // Construir el link (ajusta a tu ruta de frontend)
    // Pasamos el ID y el Token en la URL
    const link = `https://0103-owo.github.io/SalusCMA-APP/restablecerContrasena.html?id=${usuario.id}&token=${token}&tipo=${usuario.tipo}`;

    //Enviar el email con Resend
    await emailRecuperacion({
      email: correo,
      nombre: usuario.nombre_real || 'Usuario',
      link
    });

    res.json({ success: true, message: 'Se ha enviado un enlace de recuperación a tu correo.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
  }
};

export const restablecerPassword = async (req, res) => {
  try {
    const { id, tipo, token, nuevaPassword } = req.body;

    //Obtener al usuario de la DB para verificar su "secret" único
    const usuario = await usuarioModel.buscarUsuarioPorIdYTipo(id, tipo);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    //Verificar el token usando el secret dinámico
    const secret = process.env.JWT_SECRET + usuario.contrasena;

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ error: 'El enlace es inválido o ha expirado' });
    }

    //Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    //Actualizar en la base de datos
    await usuarioModel.actualizarPasswordPorTipo(id, tipo, hashedPassword);

    res.json({ success: true, message: 'Contraseña actualizada con éxito' });

  } catch (error) {
    res.status(500).json({ error: 'No se pudo restablecer la contraseña' });
  }
};