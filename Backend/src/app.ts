import express from 'express';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import sceneRoutes from './routes/sceneRoutes';
import config from './config';
import { setupSocketHandlers } from './socketHandlers/deviceHandler';
import { TasmotaManager } from './services/tasmotaManager';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose.connect(config.mongoUri);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/scenes', sceneRoutes);

const tasmotaManager = new TasmotaManager(config.mqttBrokerUrl);
setupSocketHandlers(io, tasmotaManager);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

export { app, httpServer, io, tasmotaManager };
