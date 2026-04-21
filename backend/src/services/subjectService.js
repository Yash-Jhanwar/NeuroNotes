import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

const assertSemesterOwnership = async (semesterId, userId) => {
  const result = await pool.query(
    `
      SELECT id
      FROM semesters
      WHERE id = $1 AND user_id = $2
      LIMIT 1;
    `,
    [semesterId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Semester not found', 404);
  }
};

export const createSubjectForSemester = async (userId, semesterId, name) => {
  await assertSemesterOwnership(semesterId, userId);

  const existingSubject = await pool.query(
    `
      SELECT id
      FROM subjects
      WHERE semester_id = $1 AND LOWER(name) = LOWER($2)
      LIMIT 1;
    `,
    [semesterId, name]
  );

  if (existingSubject.rowCount > 0) {
    throw new AppError('Subject already exists in this semester', 409);
  }

  const result = await pool.query(
    `
      INSERT INTO subjects (semester_id, name, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, semester_id, name, created_at;
    `,
    [semesterId, name]
  );

  return result.rows[0];
};

export const listSubjectsBySemester = async (userId, semesterId) => {
  await assertSemesterOwnership(semesterId, userId);

  const result = await pool.query(
    `
      SELECT id, semester_id, name, created_at
      FROM subjects
      WHERE semester_id = $1
      ORDER BY name ASC;
    `,
    [semesterId]
  );

  return result.rows;
};
