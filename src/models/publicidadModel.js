import db from '../config/db.js';

export const getPublicidad = async () => {
    const [rows] = await db.query('SELECT * FROM publicidad WHERE id_publicidad = 1');
    return rows[0];
};

export const updatePublicidad = async (datos) => {
    const { img_uno, img_dos, img_tres, id } = datos;
    
    let sql = `UPDATE publicidad SET id_publicidad = ?`;
    let params = [id];

    if (img_uno) { sql += `, img_uno = ?`; params.push(img_uno); }
    if (img_dos) { sql += `, img_dos = ?`; params.push(img_dos); }
    if (img_tres) { sql += `, img_tres = ?`; params.push(img_tres); }

    sql += ` WHERE id_publicidad = ?`;
    params.push(id);

    return await db.query(sql, params);
};