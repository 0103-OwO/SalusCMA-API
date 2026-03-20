import db from '../config/db.js';

export const getAllHistorial = async () => {
    const [rows] = await db.query('SELECT * FROM historial');
    return rows;
};
