import db from '../config/db.js';

export const getAllUsuarios = async () => {
  const query = `
    SELECT 
        u.id_usuario, 
        u.usuario, 
        r.nombre AS nombre_rol, 
        t.nombre AS nombre_trabajador, 
        u.id_rol, 
        u.id_trabajador
    FROM usuario u
    JOIN rol r ON u.id_rol = r.id_rol
    JOIN trabajadores t ON u.id_trabajador = t.id_trabajador
  `;
  const [rows] = await db.query(query);
  return rows;
};

export const getUsuarioById = async (id) => {
  const query = `
    SELECT u.*, r.nombre AS nombre_rol, t.nombre AS nombre_trabajador
    FROM usuario u
    JOIN rol r ON u.id_rol = r.id_rol
    JOIN trabajadores t ON u.id_trabajador = t.id_trabajador
    WHERE u.id_usuario = ?
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
};

export const createUsuario = async (datos) => {
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