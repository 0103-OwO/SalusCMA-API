import db from '../config/db.js';

export const getFooter = async () => {
    const [rows] = await db.query('SELECT * FROM footer WHERE id_footer = 1');
    return rows[0];
};

export const updateFooter = async (datos) => {
    const { facebook, instagram, x, img_facebook, img_instagram, img_x, mapa, id } = datos;
    
    let sql = `
        UPDATE footer 
        SET facebook = ?, instagram = ?, x = ?, mapa = ?
    `;
    let params = [facebook, instagram, x, mapa];

    if (img_facebook) { sql += `, img_facebook = ?`; params.push(img_facebook); }
    if (img_instagram) { sql += `, img_instagram = ?`; params.push(img_instagram); }
    if (img_x) { sql += `, img_x = ?`; params.push(img_x); }

    sql += ` WHERE id_footer = ?`;
    params.push(id);

    const [result] = await db.query(sql, params);
    return result;
};