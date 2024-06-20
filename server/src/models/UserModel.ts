import mongoose, { Types } from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: Types.ObjectId;
  username: string;
  passwordHash: string;
  email: string;
  room: string;
  isGoogleAccount: boolean;
  lastLogin: Date;
  createdAt: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  passwordHash: { type: String },
  email: { type: String, required: true, unique: true },
  room: { type: String, required: true },
  isGoogleAccount: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', userSchema);
