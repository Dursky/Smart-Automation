import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Scene from '../models/Scene';
import { IScene } from '../types/scene';
import { tasmotaManager } from '../app';

export const createScene = async (req: Request, res: Response) => {
  try {
    const scene: IScene = new Scene({
      ...req.body,
      createdBy: new mongoose.Types.ObjectId(req.user?.userId),
    });
    await scene.save();
    res.status(201).json(scene);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create scene' });
  }
};

export const executeScene = async (req: Request, res: Response) => {
  try {
    const scene = await Scene.findById(req.params.id);
    if (!scene) {
      return res.status(404).json({ error: 'Scene not found' });
    }
    tasmotaManager.executeScene(scene);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute scene' });
  }
};
