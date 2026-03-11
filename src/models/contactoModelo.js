import db from '../config/db.js';

export const getContacto = async () => {
    const [rows] = await db.query('SELECT * FROM contacto LIMIT 1');
    return rows[0];
};

export const updateContacto = async (datos, id) => {
    const { direccion, correo, telefono } = datos;
    const query = `
        UPDATE contacto 
        SET direccion = ?, correo = ?, telefono = ? 
        WHERE id_contacto = ?`;
    const params = [direccion, correo, telefono, id];

    return await db.query(query, params);
};