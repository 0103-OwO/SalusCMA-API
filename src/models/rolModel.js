import db from '../config/db.js';

export const getAllRoles = async () => {
  const [rows] = await db.query('SELECT * FROM rol');
  return rows;
};