import { Socket } from 'socket.io';
import { Types } from 'mongoose';

declare module 'socket.io' {
  interface Socket {
    userId?: Types.ObjectId;
  }
}
