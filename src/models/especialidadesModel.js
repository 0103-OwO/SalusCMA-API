import db from '../config/db.js';

export const getAllEspecialidades = async () => {
  const [rows] = await db.query('SELECT * FROM especialidad');
  return rows;
};

export const getEspecialidadById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM especialidad WHERE id_especialidad = ?',
    [id]
  );
  return rows[0];
};

export const createEspecialidad = async ({ especialidad }) => {
  const [result] = await db.query(
    'INSERT INTO especialidad (especialidad) VALUES (?)',
    [especialidad]
  );
  return { id_especialidad: result.insertId, especialidad };
};

export const updateEspecialidad = async (id, { especialidad }) => {
  await db.query(
    'UPDATE especialidad SET especialidad = ? WHERE id_especialidad = ?',
    [especialidad, id]
  );
  return { id_especialidad: id, especialidad };
};

export const deleteEspecialidad = async (id) => {
  await db.query(
    'DELETE FROM especialidad WHERE id_especialidad = ?',
    [id]
  );
  return { message: 'Especialidad eliminada' };
};