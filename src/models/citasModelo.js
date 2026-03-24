import db from '../config/db.js';

export const getAllCitas = async () => {
  const query = `
        SELECT 
            c.id_cita,
            DATE_FORMAT(c.fecha, '%d/%m/%Y') AS fecha,
            c.hora,
            p.curp AS curp_paciente,
            CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_medico,
            con.nombre AS nombre_consultorio,
            c.estado
        FROM citas c
        INNER JOIN pacientes p ON c.id_paciente = p.id_pacientes
        INNER JOIN trabajadores t ON c.id_medico = t.id_trabajador
        LEFT JOIN consultorio con ON c.id_consultorio = con.id_consultorio
        ORDER BY c.fecha DESC, c.hora DESC
    `;
  const [rows] = await db.query(query);
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

// Función para obtener citas de un médico específico
export const getCitasByMedico = async (id_trabajador_logueado) => {
  const query = `
        SELECT 
            c.id_cita,
            DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha, -- Formato estándar para JS
            c.hora,
            p.curp AS curp_paciente,
            CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_medico,
            con.nombre AS nombre_consultorio
        FROM citas c
        INNER JOIN pacientes p ON c.id_paciente = p.id_pacientes 
        INNER JOIN trabajadores t ON c.id_medico = t.id_trabajador 
        LEFT JOIN consultorio con ON c.id_consultorio = con.id_consultorio
        WHERE c.id_medico = ? 
        ORDER BY c.fecha ASC, c.hora ASC
    `;
  const [rows] = await db.query(query, [id_trabajador_logueado]);
  return rows;
};