import db from '../config/db.js';

export const buscarUsuarioGlobal = async (identificador) => {
    try {
        const [result] = await db.query('CALL sp_login_usuario(?)', [identificador]);
        if (result && result[0] && result[0].length > 0) {
            return result[0][0];
        }
        return null;
    } catch (error) {
        console.error("Error en buscarUsuarioGlobal:", error.message);
        throw error;
    }
};

export const getNombrePaciente = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM pacientes WHERE id_pacientes = ?', [id]);
    return rows[0];
};

export const getNombreTrabajador = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM trabajadores WHERE id_trabajador = ?', [id]);
    return rows[0];
};