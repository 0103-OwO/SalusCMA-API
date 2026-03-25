import db from '../config/db.js';

export const buscarUsuarioGlobal = async (identificador) => {
    const query = `
        SELECT 
            id_usuario_cliente AS id_usuario_tabla,
            usuario,
            contrasena,
            id_rol,
            id_paciente AS id_referencia, 
            'cliente' AS tipo_usuario
        FROM usuarios_clientes
        WHERE usuario = ? OR email = ?
        
        UNION
        
        SELECT 
            id_usuario AS id_usuario_tabla,
            usuario,
            contrasena,
            id_rol,
            id_trabajador AS id_referencia,
            'interno' AS tipo_usuario
        FROM usuario
        WHERE usuario = ?`;

    try {
        const [rows] = await db.query(query, [identificador, identificador, identificador]);
        return rows[0]; 
    } catch (error) {
        console.error("Error en buscarUsuarioGlobal:", error);
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