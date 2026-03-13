import db from '../config/db.js';

export const buscarCliente = async (identificador) => {
    const [rows] = await db.query(
        'SELECT * FROM usuarios_clientes WHERE email = ? OR usuario = ?',
        [identificador, identificador]
    );
    return rows[0];
};

export const buscarUsuarioInterno = async (usuario) => {
    const [rows] = await db.query(
        'SELECT * FROM usuario WHERE usuario = ?',
        [usuario]
    );
    return rows[0];
};

export const getNombrePaciente = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM pacientes WHERE id_pacientes = ?', [id]);
    return rows[0];
};

export const getNombreTrabajador = async (id) => {
    const [rows] = await db.query('SELECT nombre FROM trabajadores WHERE id_trabajador = ?', [id]);
    return rows[0];
};