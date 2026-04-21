import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const suggestionSchema = {
  type: 'object',
  properties: {
    important_topics: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 3,
      maxItems: 10,
    },
    study_prompt: {
      type: 'string',
    },
  },
  required: ['important_topics', 'study_prompt'],
  additionalProperties: false,
};

const buildInstructions = ({ contextType, contextText }) => `
You are an academic study assistant for a college notes management system.
Return JSON only.
Based on the provided ${contextType} context, identify the most important study topics a student should focus on.
Also generate one concise but strong study prompt the student can paste into an AI tutor for guided study.
Keep topic names practical, exam-focused, and beginner-friendly.
`;

const buildInput = ({ contextType, contextText }) => `
Context type: ${contextType}
Context:
${contextText}

Return:
1. important_topics: an array of the most important subtopics to study
2. study_prompt: one ready-to-use study prompt for an AI tutor
`;

const extractResponseText = (responseData) => {
  const text = responseData?.choices?.[0]?.message?.content;

  if (typeof text === 'string' && text.trim()) {
    return text.trim();
  }

  throw new AppError('Groq returned an empty response', 502);
};

const callGroqForSuggestions = async ({ contextType, contextText }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError('GROQ_API_KEY is missing. Add it to your .env file.', 500);
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: buildInstructions({ contextType, contextText }),
        },
        {
          role: 'user',
          content: buildInput({ contextType, contextText }),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'topic_suggestion',
          strict: true,
          schema: suggestionSchema,
        },
      },
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const message = responseData?.error?.message || 'Failed to generate AI suggestions';
    throw new AppError(message, response.status);
  }

  const parsed = JSON.parse(extractResponseText(responseData));

  if (!Array.isArray(parsed.important_topics) || typeof parsed.study_prompt !== 'string') {
    throw new AppError('Groq returned an invalid suggestion payload', 502);
  }

  return {
    important_topics: parsed.important_topics.map((topic) => topic.trim()).filter(Boolean),
    study_prompt: parsed.study_prompt.trim(),
    model: responseData.model || GROQ_MODEL,
  };
};

const storeSuggestion = async (userId, { contextType, contextText, important_topics: importantTopics, study_prompt: studyPrompt, model }) => {
  const result = await pool.query(
    `
      INSERT INTO ai_suggestions (
        user_id,
        context_type,
        context_text,
        important_topics,
        study_prompt,
        model,
        created_at
      )
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, NOW())
      RETURNING
        id,
        user_id,
        context_type,
        context_text,
        important_topics,
        study_prompt,
        model,
        created_at;
    `,
    [userId, contextType, contextText, JSON.stringify(importantTopics), studyPrompt, model]
  );

  return result.rows[0];
};

export const suggestTopicsForContext = async (userId, { contextType, contextText }) => {
  const suggestion = await callGroqForSuggestions({ contextType, contextText });

  return storeSuggestion(userId, {
    contextType,
    contextText,
    ...suggestion,
  });
};
