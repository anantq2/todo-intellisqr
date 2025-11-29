import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './db'; 
import { ErrorLog } from './models/ErrorLog';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes); // ✅ ROUTE REGISTERED

// Global Error Handler 
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  try {
    await ErrorLog.create({
      message: err.message,
      stack: err.stack,
      route: req.originalUrl,
      method: req.method,
    });
  } catch (logError) {
    console.error('Error logging failed', logError);
  }

  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});