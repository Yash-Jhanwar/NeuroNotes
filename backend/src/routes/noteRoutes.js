import { Router } from 'express';
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  deleteNote 
} from '../controllers/noteController.js';

const router = Router();

// Route Context: /api/notes
// Remember: Our syncUser middleware in app.js globally checks the Clerk token on /api 
// and maps req.userId before it ever hits these endpoints. No explicit requireAuth logic needed here.

router.route('/')
  .post(createNote) // Create note
  .get(getNotes);   // Fetch all user's notes

router.route('/:id')
  .get(getNoteById)  // Fetch specific user's note
  .delete(deleteNote); // Delete a user's note

export default router;
