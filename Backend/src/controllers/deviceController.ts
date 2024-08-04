import { Request, Response } from 'express';
import { tasmotaManager } from '../app';

export const getDevices = (req: Request, res: Response) => {
  const devices = tasmotaManager.listDevices();
  res.json(devices);
};

export const toggleDevice = (req: Request, res: Response) => {
  const { id, state } = req.body;
  tasmotaManager.toggleDevice(id, state);
  res.json({ success: true });
};
