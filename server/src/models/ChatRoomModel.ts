import mongoose from 'mongoose';

export interface IChatRoom extends mongoose.Document {
  name: string;
  members: string[];
}

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
