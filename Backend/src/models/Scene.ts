import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  state: { type: String, enum: ['ON', 'OFF'], required: true },
});

const sceneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  actions: [actionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Scene', sceneSchema);
