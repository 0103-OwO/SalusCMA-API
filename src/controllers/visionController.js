import db from '../config/db.js';

export const getLogoById = async (id) => {
  const [rows] = await db.query('SELECT logo FROM imagenes WHERE id_img = ?', [id]);
  return rows[0];
};

export const getMisionVision = async () => {
  const [rows] = await db.query('SELECT * FROM mision_vision ORDER BY id_mision_vision ASC LIMIT 1');
  return rows[0];
};