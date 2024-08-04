import { Server, Socket } from 'socket.io';
import { TasmotaManager } from '../services/tasmotaManager';
import jwt from 'jsonwebtoken';
import config from '../config';

export const setupSocketHandlers = (io: Server, tasmotaManager: TasmotaManager) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token; //Postman support

    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      console.log({ error });
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('-> New client connected');

    socket.emit('deviceList', tasmotaManager.listDevices());

    socket.on('getDevices', () => {
      socket.emit('deviceList', tasmotaManager.listDevices());
    });

    socket.on('toggleDevice', ({ id, state }) => {
      tasmotaManager.toggleDevice(id, state);
    });

    tasmotaManager.on('deviceUpdated', (device) => {
      socket.emit('deviceUpdated', device);
    });

    tasmotaManager.on('deviceLost', (id) => {
      socket.emit('deviceLost', id);
    });

    tasmotaManager.on('stateChanged', (device) => {
      socket.emit('stateChanged', device);
    });

    socket.on('toggleDevice', (data: string) => {
      try {
        const parsedData = JSON.parse(data) as { deviceId: string; state: 'ON' | 'OFF' };

        tasmotaManager.toggleDevice(parsedData.deviceId, parsedData.state);
        socket.emit('toggleResult', {
          success: true,
          deviceId: parsedData.deviceId,
          state: parsedData.state,
        });
      } catch (error) {
        socket.emit('toggleResult', { success: false, error: (error as Error).message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
