import db from '../config/db.js';

export const getContacto = async () => {
    const [rows] = await db.query('SELECT * FROM contacto LIMIT 1');
    return rows[0];
};