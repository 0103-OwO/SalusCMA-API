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

// Busca por correo en ambas tablas 
export const buscarUsuarioPorCorreo = async (email) => {
  const [cliente] = await db.query('SELECT id_usuario_cliente AS id, email, contrasena AS password, "cliente" AS tipo FROM usuarios_clientes WHERE email = ?', [email]);
  if (cliente.length > 0) return cliente[0];

  const [interno] = await db.query('SELECT u.id_usuario AS id, t.correo AS email, u.contrasena AS password, "interno" AS tipo FROM usuario u JOIN trabajadores t ON u.id_trabajador = t.id_trabajador WHERE t.correo = ?', [email]);
  if (interno.length > 0) return interno[0];
  return null;
};

// Busca por ID y Tipo para validar el JWT
export const buscarUsuarioPorIdYTipo = async (id, tipo) => {
  const tabla = tipo === 'cliente' ? 'usuarios_clientes' : 'usuario';
  const idCol = tipo === 'cliente' ? 'id_usuario_cliente' : 'id_usuario';
  const [rows] = await db.query(`SELECT * FROM ${tabla} WHERE ${idCol} = ?`, [id]);
  return rows[0];
};

// Actualiza la contraseña
export const actualizarPasswordPorTipo = async (id, tipo, password) => {
  const tabla = tipo === 'cliente' ? 'usuarios_clientes' : 'usuario';
  const idCol = tipo === 'cliente' ? 'id_usuario_cliente' : 'id_usuario';
  return await db.query(`UPDATE ${tabla} SET contrasena = ? WHERE ${idCol} = ?`, [password, id]);
};

export const desactivarCuentaPaciente = async (idPaciente) => {
  const query = `UPDATE usuarios_clientes SET activo = 0 WHERE id_paciente = ?`;
  const [result] = await db.query(query, [idPaciente]);
  return result.affectedRows > 0;
};

export const reactivarCuentaPorIdentificador = async (identificador) => {
  try {
    const query = `
            UPDATE usuarios_clientes 
            SET activo = 1 
            WHERE (usuario = ? OR email = ?) AND activo = 0`;

    const [result] = await db.query(query, [identificador, identificador]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en modelo reactivarCuenta:", error);
    throw error;
  }
};

export const getPasswordById = async (id, rol) => {
    const tabla = (rol === 'paciente') ? 'usuarios_clientes' : 'trabajadores';
    const campoId = (rol === 'paciente') ? 'id_usuario' : 'id_trabajador';

    const query = `SELECT contrasena FROM ${tabla} WHERE ${campoId} = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const updatePassword = async (id, rol, nuevoHash) => {
    const tabla = (rol === 'paciente') ? 'usuarios_clientes' : 'trabajadores';
    const campoId = (rol === 'paciente') ? 'id_usuario' : 'id_trabajador';

    const query = `UPDATE ${tabla} SET contrasena = ? WHERE ${campoId} = ?`;
    await db.query(query, [nuevoHash, id]);
    return true;
};