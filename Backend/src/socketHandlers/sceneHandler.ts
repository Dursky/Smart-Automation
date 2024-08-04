import { Server, Socket } from 'socket.io';
import Scene from '../models/Scene';
import { TasmotaManager } from '../services/tasmotaManager';

export const setupSceneSocketHandlers = (io: Server, tasmotaManager: TasmotaManager) => {
  io.on('connection', (socket: Socket) => {
    socket.on('getScenes', async (userId: string) => {
      const scenes = await Scene.find({ createdBy: userId });
      socket.emit('sceneList', scenes);
    });

    socket.on('executeScene', async (sceneId: string) => {
      try {
        const scene = await Scene.findById(sceneId);
        if (scene) {
          tasmotaManager.executeScene(scene);
          socket.emit('sceneExecuted', { success: true, sceneId });
        } else {
          socket.emit('sceneExecuted', { success: false, error: 'Scene not found' });
        }
      } catch (error) {
        socket.emit('sceneExecuted', { success: false, error: 'Failed to execute scene' });
      }
    });
  });
};
