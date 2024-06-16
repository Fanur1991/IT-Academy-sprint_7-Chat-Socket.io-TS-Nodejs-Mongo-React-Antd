import { Socket } from 'socket.io';

function handleConnection(socket: Socket) {
  console.log(`User connected ${socket.id}`);
  
  socket.on('join_room', (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  })

  socket.on('message', (message: string) => {
    console.log(`Message from ${socket.id}: ${message}`);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
  });
}

export { handleConnection };
