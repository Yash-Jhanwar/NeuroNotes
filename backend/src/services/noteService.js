import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import { assertTopicOwnership } from './accessService.js';

export const createNoteForTopic = async (userId, topicId, title, content) => {
  await assertTopicOwnership(topicId, userId);

  const result = await pool.query(
    `
      INSERT INTO notes (topic_id, title, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, topic_id, title, content, created_at;
    `,
    [topicId, title, content]
  );

  return result.rows[0];
};

export const listNotesByTopic = async (userId, topicId) => {
  await assertTopicOwnership(topicId, userId);

  const result = await pool.query(
    `
      SELECT id, topic_id, title, content, created_at
      FROM notes
      WHERE topic_id = $1
      ORDER BY created_at DESC;
    `,
    [topicId]
  );

  return result.rows;
};
