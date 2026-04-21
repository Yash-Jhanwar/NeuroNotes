import { clerkMiddleware, getAuth } from '@clerk/express';
import pool from '../../config/db.js';

export const setupClerkAuth = clerkMiddleware();

/**
 * Ensures user exists in our Database.
 * Creates a record if they don't, mapping the Clerk Auth to Supabase Users table.
 */
export const syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing Clerk Token'
      });
    }

    // Check if the user exists in our DB
    const checkQuery = 'SELECT id FROM users WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [userId]);

    if (checkResult.rows.length === 0) {
      // User not found, insert them using their Clerk ID
      const insertQuery = 'INSERT INTO users (id) VALUES ($1)';
      await pool.query(insertQuery, [userId]);
    }

    // Attach userId to request object for further use in controllers
    req.userId = userId;

    next();
  } catch (error) {
    console.error('Error in syncUser middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during user sync'
    });
  }
};
