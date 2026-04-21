import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

export const listSemesters = async (userId) => {
  const result = await pool.query(
    `
      SELECT id, user_id, semester_number, created_at
      FROM semesters
      WHERE user_id = $1
      ORDER BY semester_number ASC;
    `,
    [userId]
  );

  return result.rows;
};

export const createSemesterForUser = async (userId, semesterNumber) => {
  const existingSemester = await pool.query(
    `
      SELECT id
      FROM semesters
      WHERE user_id = $1 AND semester_number = $2
      LIMIT 1;
    `,
    [userId, semesterNumber]
  );

  if (existingSemester.rowCount > 0) {
    throw new AppError('Semester already exists', 409);
  }

  const result = await pool.query(
    `
      INSERT INTO semesters (user_id, semester_number, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, user_id, semester_number, created_at;
    `,
    [userId, semesterNumber]
  );

  return result.rows[0];
};
