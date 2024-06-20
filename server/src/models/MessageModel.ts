import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  username: string;
  senderId: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', messageSchema);
