import { Socket, Server as SocketIOServer } from 'socket.io';
import MessageModel from '../models/MessageModel';
import ChatModel, { IChat } from '../models/ChatModel';
import mongoose, { Types } from 'mongoose';

const onlineUsers: { [key: string]: string } = {};

function handleConnection(socket: Socket, io: SocketIOServer) {
  console.log(`User connected ${socket.id}`);

  // * Get user ID
  const userId = socket.handshake.query.userId as string | string[] | undefined;

  if (userId) {
    const userIdString = Array.isArray(userId) ? userId[0] : userId;
    onlineUsers[userIdString] = socket.id;
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
  }

  if (Array.isArray(userId)) {
    socket.userId = new Types.ObjectId(userId[0]);
  } else {
    socket.userId = new Types.ObjectId(userId);
  }

  // * Join the room
  socket.on('join_room', async (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);

    try {
      let chatRoom = await ChatModel.findOne({ name: room });
      if (!chatRoom) {
        chatRoom = new ChatModel({ name: room, members: [], messages: [] });
        await chatRoom.save();

        console.log(`New chat room created with ID: ${room}`);
      }

      if (
        socket.userId &&
        !chatRoom.members
          .map(member => member.toString())
          .includes(socket.userId.toString())
      ) {
        chatRoom.members.push(socket.userId);

        await chatRoom.save();
        console.log(`User ${socket.userId} added to chat room ${room}`);
      }

      const messages = await MessageModel.find({ chatRoomId: chatRoom._id });

      socket.emit('room_history', messages);
    } catch (error) {
      console.error('Error handling room join:', error);
      socket.emit('error', 'Failed to handle room join');
    }
  });

  // * Send message
  socket.on('send_message', async ({ username, text, senderId, room }) => {
    try {
      console.log('Received message data:', { username, text, senderId, room });

      const chatRoom = (await ChatModel.findOne({ name: room })) as IChat & {
        _id: mongoose.Types.ObjectId;
      };
      if (!chatRoom) {
        console.log('Room not found!');
        return;
      }

      const message = new MessageModel({
        username,
        text,
        senderId,
        chatRoomId: chatRoom._id,
      });

      await message.save();

      chatRoom.messages.push(message._id as Types.ObjectId);

      await chatRoom.save();

      console.log('Chat room updated with new message:', chatRoom);

      io.to(chatRoom._id.toString()).emit('receive_message', {
        text: message.text,
        senderId: message.senderId,
        room: chatRoom._id.toString(),
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  });

  // * Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);

    if (userId) {
      const userIdString = Array.isArray(userId) ? userId[0] : userId;
      delete onlineUsers[userIdString];
    }

    io.emit('getOnlineUsers', Object.keys(onlineUsers));
  });
}

export { handleConnection };
