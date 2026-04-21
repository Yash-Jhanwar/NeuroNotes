import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import { assertTopicOwnership, assertUnitOwnership } from './accessService.js';

export const createTopicForUnit = async (userId, unitId, title, isImportant) => {
  await assertUnitOwnership(unitId, userId);

  const existingTopic = await pool.query(
    `
      SELECT id
      FROM topics
      WHERE unit_id = $1 AND LOWER(title) = LOWER($2)
      LIMIT 1;
    `,
    [unitId, title]
  );

  if (existingTopic.rowCount > 0) {
    throw new AppError('Topic already exists in this unit', 409);
  }

  const result = await pool.query(
    `
      INSERT INTO topics (unit_id, title, is_important, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, unit_id, title, is_important, created_at;
    `,
    [unitId, title, isImportant]
  );

  return result.rows[0];
};

export const markTopicImportant = async (userId, topicId, isImportant) => {
  await assertTopicOwnership(topicId, userId);

  const result = await pool.query(
    `
      UPDATE topics
      SET is_important = $2
      WHERE id = $1
      RETURNING id, unit_id, title, is_important, created_at;
    `,
    [topicId, isImportant]
  );

  if (result.rowCount === 0) {
    throw new AppError('Topic not found', 404);
  }

  return result.rows[0];
};
