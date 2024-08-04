import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  groupTopic: { type: String },
  state: { type: String, enum: ['ON', 'OFF'], required: true },
  name: { type: String },
  type: { type: String },
  ip: { type: String },
});

export default mongoose.model('Device', deviceSchema);
