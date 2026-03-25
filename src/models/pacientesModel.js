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
    curp, nombre, apellido_paterno, apellido_materno,
    sexo, fecha_nacimiento, correo, usuario, contrasena
  } = datos;

  const queryPaciente = `
        INSERT INTO pacientes (curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento) 
        VALUES (?, ?, ?, ?, ?, ?)`;

  const [resPaciente] = await db.query(queryPaciente, [
    curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento
  ]);

  const id_paciente = resPaciente.insertId;

  const queryUsuario = `
        INSERT INTO usuarios_clientes (email, usuario, contrasena, id_rol, id_paciente) 
        VALUES (?, ?, ?, ?, ?)`;

  const [resUsuario] = await db.query(queryUsuario, [
    correo, usuario, contrasena, 19, id_paciente
  ]);

  return { id_paciente, success: true };
};

export const getPacienteFullProfile = async (id) => {

  const query = `
        SELECT p.id_pacientes, p.curp, p.nombre, p.apellido_paterno, p.apellido_materno, 
               p.sexo, p.fecha_nacimiento, u.email, u.usuario
        FROM pacientes p
        INNER JOIN usuarios_clientes u ON u.id_paciente = p.id_pacientes
        WHERE p.id_pacientes = ?`;
  const [rows] = await db.query(query, [id]);
  return rows[0];
};

export const updatePacienteYUsuario = async (id_paciente, datos) => {
  const {
    curp, nombre, apellido_paterno, apellido_materno,
    sexo, fecha_nacimiento, email, usuario, contrasena
  } = datos;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const queryPacientes = `
            UPDATE pacientes 
            SET curp = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?, sexo = ?, fecha_nacimiento = ?
            WHERE id_pacientes = ?`;

    await connection.query(queryPacientes, [
      curp, nombre, apellido_paterno, apellido_materno, sexo, fecha_nacimiento, id_paciente
    ]);

    let queryUsuarios = `UPDATE usuarios_clientes SET email = ?, usuario = ?`;
    const paramsUsuarios = [email, usuario];

    if (contrasena) {
      queryUsuarios += `, contrasena = ?`;
      paramsUsuarios.push(contrasena);
    }

    queryUsuarios += ` WHERE id_paciente = ?`;
    paramsUsuarios.push(id_paciente);

    await connection.query(queryUsuarios, paramsUsuarios);

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


export const checkEmailExists = async (email) => {
  const query = `
        SELECT email FROM (
            SELECT email FROM usuarios_clientes
            UNION
            SELECT correo AS email FROM trabajadores
        ) AS todos_los_correos
        WHERE email = ? LIMIT 1
    `;
  const [rows] = await db.query(query, [email]);
  return rows.length > 0;
};