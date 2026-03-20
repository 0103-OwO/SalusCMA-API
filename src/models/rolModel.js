import db from '../config/db.js';

export const getRol = async () => {
    const [rows] = await db.query('SELECT * FROM rol');
    return rows[0];
};