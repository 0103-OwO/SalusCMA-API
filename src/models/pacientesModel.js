import db from '../config/db.js';

export const checkCurpExists = async (curp, id = null) => {
  if (id) {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM pacientes WHERE curp = ? AND id_pacientes != ?',
      [curp, id]
    );
    return result[0].count > 0;
  }
  const [result] = await db.query('SELECT fn_curp_existe(?) AS existe', [curp]);
  return result[0].existe === 1;
};

export const checkUserExists = async (usuario) => {
  const [result] = await db.query('SELECT fn_usuario_existe(?) AS existe', [usuario]);
  return result[0].existe === 1;
};

export const getAllPacientes = async () => {
  const [rows] = await db.query('SELECT * FROM pacientes');
  return rows;
};

export const getPacienteById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM pacientes WHERE id_pacientes = ?',
    [id]
  );
  return rows[0];
};

export const createPaciente = async ({
  curp,
  nombre,
  apellido_paterno,
  apellido_materno,
  sexo,
  fecha_nacimiento
}) => {
  const [result] = await db.query(
    `INSERT INTO pacientes 
    (curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento]
  );

  return { id_pacientes: result.insertId };
};

export const updatePaciente = async (id, data) => {
  await db.query(
    'UPDATE pacientes SET ? WHERE id_pacientes = ?',
    [data, id]
  );
  return { id_pacientes: id, ...data };
};

export const deletePaciente = async (id) => {
  await db.query(
    'DELETE FROM pacientes WHERE id_pacientes = ?',
    [id]
  );
  return { message: 'Paciente eliminado' };
};

export const createPacienteCompleto = async (datos) => {
  const {
    curp,
    nombre,
    apellido_paterno,
    apellido_materno,
    sexo,
    fecha_nacimiento,
    correo,
    usuario,
    contrasena
  } = datos;

  const [result] = await db.query(
    'CALL sp_registrar_paciente_completo(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento, correo, usuario, contrasena]
  );

  return result;
};

export const getPacienteFullProfile = async (id_usuario_cliente) => {
  const query = `
        SELECT 
            p.id_pacientes,
            p.curp,
            p.nombre,
            p.apellido_paterno,
            p.apellido_materno,
            p.sexo,
            p.fecha_nacimiento,
            u.usuario,
            u.email
        FROM pacientes p
        INNER JOIN usuarios_clientes u ON p.id_pacientes = u.id_paciente
        WHERE u.id_usuario_cliente = ?
    `;
  const [rows] = await db.query(query, [id_usuario_cliente]);
  return rows[0];
};