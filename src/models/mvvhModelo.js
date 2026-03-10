import db from '../config/db.js';

export const getMisionVision = async () => {
    const [rows] = await db.query('SELECT * FROM mision_vision WHERE id_mision_vision = 1');
    return rows[0];
};

export const updateSeccion = async (campoTexto, valorTexto, campoImg, valorImg, id) => {
    let sql;
    let params;

    if (valorImg) {
        sql = `UPDATE mision_vision SET ${campoTexto} = ?, ${campoImg} = ? WHERE id_mision_vision = ?`;
        params = [valorTexto, valorImg, id];
    } else {
        sql = `UPDATE mision_vision SET ${campoTexto} = ? WHERE id_mision_vision = ?`;
        params = [valorTexto, id];
    }

    const [result] = await db.query(sql, params);
    return result;
};