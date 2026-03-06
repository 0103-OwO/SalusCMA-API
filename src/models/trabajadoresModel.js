import db from '../config/db.js';

export const getAllTrabajadores = async () => {
  const [rows] = await db.query('SELECT * FROM trabajadores');
  return rows;
};

export const getTrabajadorById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM trabajadores WHERE id_trabajador = ?',
    [id]
  );
  return rows[0];
};

export const createTrabajador = async (data) => {
  const [result] = await db.query(
    'INSERT INTO trabajadores SET ?',
    [data]
  );

  return { id_trabajador: result.insertId };
};

export const updateTrabajador = async (id, data) => {
  await db.query(
    'UPDATE trabajadores SET ? WHERE id_trabajador = ?',
    [data, id]
  );
  return { id_trabajador: id, ...data };
};

export const deleteTrabajador = async (id) => {
  await db.query(
    'DELETE FROM trabajadores WHERE id_trabajador = ?',
    [id]
  );
  return { message: 'Trabajador eliminado' };
};

