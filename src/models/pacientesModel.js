import db from '../config/db.js';

export const checkCurpExists = async (curp) => {
  const [result] = await db.query('SELECT fn_curp_existe(?) AS existe', [curp]);
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

