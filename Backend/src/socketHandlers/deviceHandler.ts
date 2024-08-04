import { Server, Socket } from 'socket.io';
import { TasmotaManager } from '../services/tasmotaManager';

export const setupSocketHandlers = (io: Server, tasmotaManager: TasmotaManager) => {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected');

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

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
