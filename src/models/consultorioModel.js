import db from '../config/db.js';

export const getAllConsultorios = async () => {
  const [rows] = await db.query('SELECT * FROM consultorio');
  return rows;
};

export const getConsultorioById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM consultorio WHERE id_consultorio = ?',
    [id]
  );
  return rows[0];
};

export const createConsultorio = async ({
  descripcion,
  nombre,
  area,
  piso
}) => {
  const [result] = await db.query(
    `INSERT INTO consultorio (descripcion, nombre, area, piso)
     VALUES (?, ?, ?, ?)`,
    [descripcion, nombre, area, piso]
  );

  return { id_consultorio: result.insertId };
};

export const updateConsultorio = async (id, data) => {
  await db.query(
    'UPDATE consultorio SET ? WHERE id_consultorio = ?',
    [data, id]
  );
  return { id_consultorio: id, ...data };
};

export const deleteConsultorio = async (id) => {
  await db.query(
    'DELETE FROM consultorio WHERE id_consultorio = ?',
    [id]
  );
  return { message: 'Consultorio eliminado' };
};

export const verificarDuplicado = async (nombre, idExcluido = 0) => {
  const [rows] = await db.query(
    'SELECT id_consultorio FROM consultorio WHERE nombre = ? AND id_consultorio != ?',
    [nombre, idExcluido]
  );
  return rows.length > 0;
};