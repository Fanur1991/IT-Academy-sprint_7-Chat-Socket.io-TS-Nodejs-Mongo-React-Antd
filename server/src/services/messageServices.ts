import MessageModel from '../models/MessageModel';
import ChatModel from '../models/ChatModel';

export const searchRoomMessages = async (room: string, query: string) => {
  try {
    const chatRoom = await ChatModel.findOne({ roomName: room });

    if (!chatRoom) {
      throw new Error(`Room with name ${room} not found`);
    }

    const messages = await MessageModel.find({
      chatRoomId: chatRoom._id,
      text: { $regex: query, $options: 'i' },
    });

    return messages;
  } catch (error: any) {
    console.error('Failed to search messages:', error);
    throw new Error('Failed to search messages');
  }
};
