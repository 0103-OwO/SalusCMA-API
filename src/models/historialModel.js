import db from '../config/db.js';

export const registrarHistorialProceso = async (datos) => {
    const {
        id_cita, tension, peso, talla, temperatura, descripcion
    } = datos;

    const query = `CALL sp_finalizar_cita(?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [
        id_cita, tension, peso, talla, temperatura, descripcion
    ]);
    return result;
};

export const getAllHistoriales = async () => {
    const query = `
        SELECT 
            h.id_historial,
            h.numero_cita,
            h.id_paciente,
            p.curp AS curp_paciente,
            CONCAT(p.nombre, ' ', p.apellido_paterno) AS nombre_paciente,
            p.fecha_nacimiento,
            p.sexo,
            h.id_medico,
            CONCAT(t.nombre, ' ', t.apellido_paterno) AS nombre_medico,
            h.id_consultorio,
            con.nombre AS nombre_consultorio,
            DATE_FORMAT(h.fecha, '%Y-%m-%d') AS fecha,
            h.hora,
            h.tension_arterial,
            h.peso,
            h.talla,
            h.temperatura,
            h.descripcion
        FROM historial h
        INNER JOIN pacientes p ON h.id_paciente = p.id_pacientes
        INNER JOIN trabajadores t ON h.id_medico = t.id_trabajador
        LEFT JOIN consultorio con ON h.id_consultorio = con.id_consultorio
        ORDER BY h.fecha DESC, h.hora DESC`;

    const [rows] = await db.query(query);
    return rows;
};

export const getHistorialById = async (id) => {
    const query = `
        SELECT 
            h.*, 
            p.curp AS curp_paciente,
            CONCAT(p.nombre, ' ', p.apellido_paterno) AS nombre_paciente
        FROM historial h
        INNER JOIN pacientes p ON h.id_paciente = p.id_pacientes
        WHERE h.id_historial = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const getHistorialesByMedico = async (id_trabajador) => {
    const query = `
        SELECT 
            h.id_historial,
            h.numero_cita,
            p.curp AS curp_paciente,
            CONCAT(t.nombre, ' ', t.apellido_paterno) AS nombre_medico,
            con.nombre AS nombre_consultorio,
            DATE_FORMAT(h.fecha, '%Y-%m-%d') AS fecha,
            h.hora,
            h.tension_arterial,
            h.peso,
            h.talla,
            h.temperatura,
            h.descripcion
        FROM historial h
        INNER JOIN pacientes p ON h.id_paciente = p.id_pacientes
        INNER JOIN trabajadores t ON h.id_medico = t.id_trabajador
        LEFT JOIN consultorio con ON h.id_consultorio = con.id_consultorio
        WHERE h.id_medico = ?
        ORDER BY h.fecha DESC, h.hora DESC`;
    const [rows] = await db.query(query, [id_trabajador]);
    return rows;
};

export const getResumenMensual = async () => {
    const query = `
        SELECT
            DATE_FORMAT(h.fecha, '%Y-%m') AS mes,
            COUNT(*)                       AS total_citas
        FROM historial h
        GROUP BY DATE_FORMAT(h.fecha, '%Y-%m')
        ORDER BY mes ASC`;
    const [rows] = await db.query(query);
    return rows;
};

export const updateHistorial = async (id, data) => {
    const query = `UPDATE historial SET ? WHERE id_historial = ?`;
    await db.query(query, [data, id]);
    return { id_historial: id, ...data };
};

export const deleteHistorial = async (id) => {
    await db.query('DELETE FROM historial WHERE id_historial = ?', [id]);
    return { message: 'Historial eliminado' };
};