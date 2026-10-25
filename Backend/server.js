import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import learningRoutes from './routes/learningRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Needed on Render/Heroku/etc. so rate limiting and secure cookies see the real client
app.set('trust proxy', 1);

// Security and utility middleware
app.use(helmet());

const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  'http://localhost:5173',
  clientUrl,
  clientUrl ? clientUrl.replace(/\/$/, '') : null
].filter(Boolean);

// Vercel deployment/preview addresses that belong to YOUR account only
// e.g. https://skill-path-ioc7bn6p2-vishal-maurya1.vercel.app
const vercelPattern = /^https:\/\/skill-path[a-z0-9-]*-vishal-maurya1\.vercel\.app$/;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/learning', learningRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SkillPath AI API is running' }));

// Root (frontend is hosted separately on Vercel)
app.get('/', (req, res) => res.send('API is running....'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});