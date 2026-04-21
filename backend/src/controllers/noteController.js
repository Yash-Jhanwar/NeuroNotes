import asyncHandler from '../utils/asyncHandler.js';
import { createNoteForTopic, listNotesByTopic } from '../services/noteService.js';

export const createNote = asyncHandler(async (req, res) => {
  const note = await createNoteForTopic(
    req.user.userId,
    req.body.topic_id,
    req.body.title,
    req.body.content
  );

  res.status(201).json({
    success: true,
    data: note
  });
});

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await listNotesByTopic(req.user.userId, req.params.topicId);

  res.status(200).json({
    success: true,
    data: notes
  });
});
