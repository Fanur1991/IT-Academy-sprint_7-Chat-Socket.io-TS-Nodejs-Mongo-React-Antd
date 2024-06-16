import { Socket, Server as SocketIOServer } from 'socket.io';
import MessageModel from '../models/MessageModel';

function handleConnection(socket: Socket, io: SocketIOServer) {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', async (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);

    try {
      const messages = await MessageModel.find({ chatRoomId: room }).limit(50);
      socket.emit('room_history', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('error', 'Failed to fetch messages');
    }
  });

  socket.on('send_message', async ({ text, senderId, room }) => {
    try {
      console.log('Received message data:', { text, senderId, room });

      const message = new MessageModel({ text, senderId, chatRoomId: room });
      await message.save();
      io.to(room).emit('receive_message', {
        text,
        senderId,
        room,
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
  });
}

export { handleConnection };
