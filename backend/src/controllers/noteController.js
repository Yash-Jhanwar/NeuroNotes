import pool from '../config/db.js';

// POST /api/notes
// Scope: Create a note linked tightly to the user
export const createNote = async (req, res, next) => {
  try {
    const userId = req.userId; // Provided globally by syncUser middleware
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Missing title or content' });
    }

    // Insert Note specifically assigning user_id
    const query = `
      INSERT INTO notes (title, content, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [title, content, userId];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/notes
// Scope: Fetch all notes strictly corresponding where user_id matches
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.userId;

    const query = `
      SELECT * FROM notes
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const values = [userId];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/notes/:id
// Scope: Fetch specific note by checking BOTH id and user ownership
export const getNoteById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const query = `
      SELECT * FROM notes
      WHERE id = $1 AND user_id = $2;
    `;
    const values = [id, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    // If the cast to UUID fails (e.g. they pass a random string as ID format), redirect it to general error
    next(error);
  }
};

// DELETE /api/notes/:id
// Scope: Delete note checking BOTH id and user ownership
export const deleteNote = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const query = `
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const values = [id, userId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found or you do not have permission to delete it' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
