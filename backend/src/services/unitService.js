import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import { assertSubjectOwnership } from './accessService.js';

export const createUnitForSubject = async (userId, subjectId, unitNumber, title) => {
  await assertSubjectOwnership(subjectId, userId);

  const existingUnit = await pool.query(
    `
      SELECT id
      FROM units
      WHERE subject_id = $1 AND unit_number = $2
      LIMIT 1;
    `,
    [subjectId, unitNumber]
  );

  if (existingUnit.rowCount > 0) {
    throw new AppError('Unit already exists in this subject', 409);
  }

  const result = await pool.query(
    `
      INSERT INTO units (subject_id, unit_number, title, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, subject_id, unit_number, title, created_at;
    `,
    [subjectId, unitNumber, title]
  );

  return result.rows[0];
};

export const listUnitsBySubject = async (userId, subjectId) => {
  await assertSubjectOwnership(subjectId, userId);

  const result = await pool.query(
    `
      SELECT id, subject_id, unit_number, title, created_at
      FROM units
      WHERE subject_id = $1
      ORDER BY unit_number ASC;
    `,
    [subjectId]
  );

  return result.rows;
};
