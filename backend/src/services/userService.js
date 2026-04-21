import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getUserById = async (userId) => {
  const result = await pool.query(
    `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
      LIMIT 1;
    `,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('User not found', 404);
  }

  return result.rows[0];
};
