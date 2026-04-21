import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

export const assertSubjectOwnership = async (subjectId, userId) => {
  const result = await pool.query(
    `
      SELECT s.id
      FROM subjects s
      INNER JOIN semesters sem ON sem.id = s.semester_id
      WHERE s.id = $1 AND sem.user_id = $2
      LIMIT 1;
    `,
    [subjectId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Subject not found', 404);
  }
};

export const assertUnitOwnership = async (unitId, userId) => {
  const result = await pool.query(
    `
      SELECT u.id
      FROM units u
      INNER JOIN subjects s ON s.id = u.subject_id
      INNER JOIN semesters sem ON sem.id = s.semester_id
      WHERE u.id = $1 AND sem.user_id = $2
      LIMIT 1;
    `,
    [unitId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Unit not found', 404);
  }
};

export const assertTopicOwnership = async (topicId, userId) => {
  const result = await pool.query(
    `
      SELECT t.id
      FROM topics t
      INNER JOIN units u ON u.id = t.unit_id
      INNER JOIN subjects s ON s.id = u.subject_id
      INNER JOIN semesters sem ON sem.id = s.semester_id
      WHERE t.id = $1 AND sem.user_id = $2
      LIMIT 1;
    `,
    [topicId, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Topic not found', 404);
  }
};
