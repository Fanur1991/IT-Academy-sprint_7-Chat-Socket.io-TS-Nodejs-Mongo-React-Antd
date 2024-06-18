import { SetStateAction, Dispatch, ReactNode } from 'react';
import { Socket } from 'socket.io-client';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  room: string;
  isGoogleAccount?: boolean;
  token?: string;
}

export interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

export interface IAuthContext {
  authUser: IUser | null;
  setAuthUser: Dispatch<SetStateAction<IUser | null>>;
}

export interface IAuthProviderProps {
  children: ReactNode;
}

export interface IMessage {
  username: string;
  text: string;
  senderId: string;
  room: string;
  createdAt: Date | string;
}
