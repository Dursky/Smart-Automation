import { Document, Types } from 'mongoose';

export interface Action {
  deviceId: string;
  state: 'ON' | 'OFF';
}

export interface IScene extends Document {
  name: string;
  actions: Action[];
  createdBy: Types.ObjectId;
}
