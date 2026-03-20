import db from '../config/db.js';

export const getAllUsuarios = async () => {
  const query = `
    SELECT u.id_usuario, u.usuario, r.nombre_rol, t.nombre as nombre_trabajador, u.id_rol, u.id_trabajador
    FROM usuario u
    JOIN roles r ON u.id_rol = r.id_rol
    JOIN trabajadores t ON u.id_trabajador = t.id_trabajador
  `;
  const [rows] = await db.query(query);
  return rows;
};

export const getUsuarioById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE id_usuario = ?',
    [id]
  );
  return rows[0];
};

export const createUsuario = async (datos) => {
  // Los campos deben coincidir con tu tabla: usuario, contrasena, id_rol, id_trabajador
  const [result] = await db.query(
    'INSERT INTO usuario SET ?',
    [datos]
  );
  return { id_usuario: result.insertId };
};

export const updateUsuario = async (id, data) => {
  await db.query(
    'UPDATE usuario SET ? WHERE id_usuario = ?',
    [data, id]
  );
  return { id_usuario: id, ...data };
};

export const deleteUsuario = async (id) => {
  await db.query(
    'DELETE FROM usuario WHERE id_usuario = ?',
    [id]
  );
  return { message: 'Usuario eliminado' };
};