import db from '../config/db.js';

export const getAllHistorial = async () => {
    const query = `
        SELECT 
            h.id_historial,
            h.numero_cita,
            p.curp AS curp_paciente,
            CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_medico,
            con.nombre AS nombre_consultorio,
            DATE_FORMAT(h.fecha, '%d/%m/%Y') AS fecha,
            h.hora,
            h.tension_arterial,
            h.peso,
            h.talla,
            h.temperatura,
            h.descripcion
        FROM historial h
        LEFT JOIN pacientes p ON h.id_paciente = p.id_pacientes
        LEFT JOIN trabajadores t ON h.id_medico = t.id_trabajador
        LEFT JOIN consultorio con ON h.id_consultorio = con.id_consultorio
        ORDER BY h.fecha DESC, h.hora DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};