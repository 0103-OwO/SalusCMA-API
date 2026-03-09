import db from '../config/db.js';

export const getLogo = async () => {
  const [rows] = await db.query('SELECT logo FROM imagenes WHERE id_img = 1');
  return rows[0];
};

export const updateLogoUrl = async (url) => {
  const [result] = await db.query(
    'UPDATE imagenes SET logo = ? WHERE id_img = 1', 
    [url]
  );
  return result;
};