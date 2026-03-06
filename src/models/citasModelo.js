import db from '../config/db.js';

export const getAllCitas = async () => {
  const [rows] = await db.query('SELECT * FROM citas');
  return rows;
};

export const getCitaById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM citas WHERE id_cita = ?',
    [id]
  );
  return rows[0];
};

export const createCita = async ({
  fecha,
  hora,
  id_paciente,
  id_medico,
  id_consultorio,
  estado,
  descripcion
}) => {
  const [result] = await db.query(
    `INSERT INTO citas 
    (fecha, hora, id_paciente, id_medico, id_consultorio, estado, descripcion)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [fecha, hora, id_paciente, id_medico, id_consultorio, estado, descripcion]
  );

  return { id_cita: result.insertId };
};

export const updateCita = async (id, data) => {
  await db.query(
    `UPDATE citas SET ? WHERE id_cita = ?`,
    [data, id]
  );
  return { id_cita: id, ...data };
};

export const deleteCita = async (id) => {
  await db.query(
    'DELETE FROM citas WHERE id_cita = ?',
    [id]
  );
  return { message: 'Cita eliminada' };
};
