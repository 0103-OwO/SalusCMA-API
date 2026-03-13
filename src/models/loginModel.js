import db from '../config/db.js';

export const buscarUsuarioGlobal = async (identificador) => {
    const [result] = await db.query('CALL sp_login_usuario(?)', [identificador]);
    return result[0][0]; 
};

export const getNombrePaciente = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM pacientes WHERE id_pacientes = ?', [id]);
    return rows[0];
};

export const getNombreTrabajador = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM trabajadores WHERE id_trabajador = ?', [id]);
    return rows[0];
};