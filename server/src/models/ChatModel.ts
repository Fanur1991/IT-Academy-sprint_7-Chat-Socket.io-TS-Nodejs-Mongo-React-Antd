import mongoose from 'mongoose';

export interface IChat extends mongoose.Document {
  name: string;
  messages: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
}

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IChat>('Chat', chatSchema);
