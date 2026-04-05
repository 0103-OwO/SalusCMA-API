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
    const link = `https://0103-owo.github.io/SalusCMA-APP/html/restablecerContrasena.html?id=${usuario.id}&token=${token}&tipo=${usuario.tipo}`;

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

export const obtenerPerfil = async (req, res) => {
  try {
    const { id, tipo } = req.user;

    let query = "";
    if (tipo === 'cliente') {
      // Consulta para pacientes
      query = "SELECT nombre, apellidos, correo, telefono, curp FROM pacientes WHERE id_paciente = ?";
    } else {
      // Consulta para trabajadores (internos)
      query = "SELECT nombre, apellidos, correo, puesto FROM trabajadores WHERE id_trabajador = ?";
    }

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    res.json({ success: true, datos: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener el perfil' });
  }
};

export const desactivarPerfil = async (req, res) => {
  try {
    const idPaciente = req.usuario.id;

    const resultado = await usuarioModel.desactivarCuentaPaciente(idPaciente);

    if (resultado) {
      res.json({ success: true, message: 'Cuenta desactivada con éxito.' });
    } else {
      res.status(400).json({ success: false, error: 'No se pudo desactivar la cuenta.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error interno del servidor.' });
  }
};

export const reactivarCuenta = async (req, res) => {
  const { identificador } = req.body;

  if (!identificador) {
    return res.status(400).json({
      success: false,
      error: 'El identificador es requerido para reactivar la cuenta.'
    });
  }

  try {
    const exito = await usuarioModel.reactivarCuentaPorIdentificador(identificador);

    if (exito) {
      return res.json({
        success: true,
        message: 'Cuenta reactivada exitosamente. Ya puedes iniciar sesión.'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'No se encontró una cuenta inactiva con esos datos.'
      });
    }
  } catch (error) {
    console.error("Error en controlador reactivarCuenta:", error);
    return res.status(500).json({
      success: false,
      error: 'Ocurrió un error interno al intentar reactivar la cuenta.'
    });
  }
};

export const cambiarContrasena = async (req, res) => {
    try {
        const { conActual, conNueva } = req.body;
        
        const { id, tipo } = req.usuario; 

        if (!id) {
            return res.status(400).json({ msg: "No se pudo identificar el ID del usuario." });
        }

        const cuenta = await model.getPasswordById(id, tipo);

        if (!cuenta) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(conActual, cuenta.contrasena);
        if (!isMatch) {
            return res.status(400).json({ msg: "La contraseña actual es incorrecta." });
        }

        const salt = await bcrypt.genSalt(10);
        const nuevoHash = await bcrypt.hash(conNueva, salt);

        await model.updatePassword(id, tipo, nuevoHash);

        res.status(200).json({ msg: "Contraseña actualizada con éxito." });

    } catch (error) {
        console.error("Error en cambiarContrasena:", error);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};