import db from '../config/db.js';

export const getPublicidad = async () => {
    const [rows] = await db.query('SELECT * FROM publicidad WHERE id_publicidad = 1');
    return rows[0];
};

export const updatePublicidad = async (id, urls) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(urls)) {
        if (value) {
            campos.push(`${key} = ?`);
            valores.push(value);
        }
    }

    if (campos.length === 0) return null;

    const sql = `UPDATE publicidad SET ${campos.join(', ')} WHERE id_publicidad = ?`;
    valores.push(id);

    const [result] = await db.query(sql, valores);
    return result;
};