import db from '../config/db.js';

export const getAllHorarios = async () => {
    const query = `
        SELECT 
            h.id_horario,
            h.hora_entrada,
            h.hora_salida,
            DATE_FORMAT(h.fecha_inicio, '%d/%m/%Y') AS fecha_inicio,
            DATE_FORMAT(h.fecha_fin, '%d/%m/%Y') AS fecha_fin,
            CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_trabajador
        FROM horarios h
        INNER JOIN trabajadores t ON h.id_trabajador = t.id_trabajador
        ORDER BY h.fecha_inicio DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

export const getHorarioById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM horarios WHERE id_horario = ?',
    [id]
  );
  return rows[0];
};

export const createHorario = async ({
  hora_entrada,
  hora_salida,
  fecha_inicio,
  fecha_fin,
  id_trabajador
}) => {
  const [result] = await db.query(
    `INSERT INTO horarios 
    (hora_entrada, hora_salida, fecha_inicio, fecha_fin, id_trabajador)
    VALUES (?, ?, ?, ?, ?)`,
    [hora_entrada, hora_salida, fecha_inicio, fecha_fin, id_trabajador]
  );

  return { id_horario: result.insertId };
};

export const updateHorario = async (id, data) => {
  await db.query(
    'UPDATE horarios SET ? WHERE id_horario = ?',
    [data, id]
  );
  return { id_horario: id, ...data };
};

export const deleteHorario = async (id) => {
  await db.query(
    'DELETE FROM horarios WHERE id_horario = ?',
    [id]
  );
  return { message: 'Horario eliminado' };
};

