import express from 'express';
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

export { app, httpServer, io, tasmotaManager };
