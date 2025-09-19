import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from "path";

import authRoutes from './src/routes/auth.js';
import taskRoutes from './src/routes/tasks.js';
import requestRoutes from './src/routes/requests.js';
import notificationRoutes from './src/routes/notifications.js';
import userRoutes from './src/routes/users.js';

import { registerSocket } from './src/socket.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE'] }
});
registerSocket(io);
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// after other middlewares
app.use('/uploads', express.static('uploads'));

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'hirehelper-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log('Server running on ' + PORT));
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });
