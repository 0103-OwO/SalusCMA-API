import db from '../config/db.js';

export const getAllTrabajadores = async () => {
  const [rows] = await db.query(`
    SELECT t.*, e.especialidad 
    FROM trabajadores t
    INNER JOIN especialidad e ON t.id_especialidad = e.id_especialidad
  `);
  return rows;
};

export const getTrabajadorById = async (id) => {
  const [rows] = await db.query('SELECT * FROM trabajadores WHERE id_trabajador = ?', [id]);
  return rows[0];
};

export const createTrabajador = async (data) => {
  const [result] = await db.query('INSERT INTO trabajadores SET ?', [data]);
  return { id_trabajador: result.insertId };
};

export const updateTrabajador = async (id, data) => {
  await db.query('UPDATE trabajadores SET ? WHERE id_trabajador = ?', [data, id]);
  return { id_trabajador: id, ...data };
};

export const deleteTrabajador = async (id) => {
  await db.query('DELETE FROM trabajadores WHERE id_trabajador = ?', [id]);
  return { message: 'Trabajador eliminado' };
};

export const getMedicos = async () => {
    const query = `
        SELECT 
            t.id_trabajador, 
            t.nombre, 
            t.apellido_paterno, 
            t.apellido_materno 
        FROM trabajadores t
        INNER JOIN usuario u ON t.id_trabajador = u.id_trabajador
        INNER JOIN rol r ON u.id_rol = r.id_rol
        WHERE r.nombre = 'Medico' OR u.id_rol = 8;
    `;
    const [rows] = await db.query(query);
    return rows;
};