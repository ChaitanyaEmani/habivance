import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
dotenv.config();
// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import timerRoutes from './routes/timerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; 
const app = express();

const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.set("trust proxy", 1);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/notifications',notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
// Error handling middleware
app.use(notFound);
app.use(errorHandler);



app.get("/", (req, res) => {
  res.send("Habit Tracker API is running...");
});

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
});
