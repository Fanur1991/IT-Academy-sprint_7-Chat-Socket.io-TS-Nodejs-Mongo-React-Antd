import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  senderId: string;
  chatRoomId: string;
  text: string;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoomId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'ChatRoom',
    type: String,
    required: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', messageSchema);
