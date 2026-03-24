import db from '../config/db.js';

export const getAllHorarios = async () => {
    const query = `
        SELECT 
            h.id_horario,
            h.lunes_ent, h.lunes_sal,
            h.martes_ent, h.martes_sal,
            h.miercoles_ent, h.miercoles_sal,
            h.jueves_ent, h.jueves_sal,
            h.viernes_ent, h.viernes_sal,
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

export const createHorario = async (data) => {
    const {
        lunes_ent, lunes_sal,
        martes_ent, martes_sal,
        miercoles_ent, miercoles_sal,
        jueves_ent, jueves_sal,
        viernes_ent, viernes_sal,
        fecha_inicio, fecha_fin,
        id_trabajador
    } = data;

    const query = `
        INSERT INTO horarios 
        (lunes_ent, lunes_sal, martes_ent, martes_sal, miercoles_ent, miercoles_sal, 
         jueves_ent, jueves_sal, viernes_ent, viernes_sal, fecha_inicio, fecha_fin, id_trabajador)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        lunes_ent || null, lunes_sal || null,
        martes_ent || null, martes_sal || null,
        miercoles_ent || null, miercoles_sal || null,
        jueves_ent || null, jueves_sal || null,
        viernes_ent || null, viernes_sal || null,
        fecha_inicio, fecha_fin, id_trabajador
    ];

    const [result] = await db.query(query, values);
    return { id_horario: result.insertId, ...data };
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

export const getHorarioByMedico = async (id_trabajador) => {
    const query = `
        SELECT 
            id_horario,
            lunes_ent, lunes_sal,
            martes_ent, martes_sal,
            miercoles_ent, miercoles_sal,
            jueves_ent, jueves_sal,
            viernes_ent, viernes_sal,
            DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
            DATE_FORMAT(fecha_fin, '%Y-%m-%d') AS fecha_fin
        FROM horarios
        WHERE id_trabajador = ?
        ORDER BY fecha_inicio DESC
    `;
    const [rows] = await db.query(query, [id_trabajador]);
    return rows;
};