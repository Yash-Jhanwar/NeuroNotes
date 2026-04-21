import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import { assertTopicOwnership } from './accessService.js';

export const createResourceForTopic = async (userId, topicId, title, url, type) => {
  await assertTopicOwnership(topicId, userId);

  const existingResource = await pool.query(
    `
      SELECT id
      FROM resources
      WHERE topic_id = $1 AND url = $2
      LIMIT 1;
    `,
    [topicId, url]
  );

  if (existingResource.rowCount > 0) {
    throw new AppError('Resource already exists for this topic', 409);
  }

  const result = await pool.query(
    `
      INSERT INTO resources (topic_id, title, url, type, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, topic_id, title, url, type, created_at;
    `,
    [topicId, title, url, type]
  );

  return result.rows[0];
};

export const listResourcesByTopic = async (userId, topicId) => {
  await assertTopicOwnership(topicId, userId);

  const result = await pool.query(
    `
      SELECT id, topic_id, title, url, type, created_at
      FROM resources
      WHERE topic_id = $1
      ORDER BY created_at DESC;
    `,
    [topicId]
  );

  return result.rows;
};
