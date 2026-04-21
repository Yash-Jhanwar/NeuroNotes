import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import semesterRoutes from './routes/semesterRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import syllabusRoutes from './routes/syllabusRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { setupClerkAuth, syncUser } from './middleware/authMiddleware.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setupClerkAuth);

// Globally protect all /api routes and sync user identity checking
app.use('/api', syncUser);

app.use('/api/health', healthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
