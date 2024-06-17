import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import io, { Socket } from 'socket.io-client';
import { ISocketContext, IAuthProviderProps } from '../types/types';

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      'useSocketContext must be used within a SocketContextProvider'
    );
  }
  return context;
};

export const SocketContextProvider: React.FC<IAuthProviderProps> = ({
  children,
}) => {
  const { authUser } = useAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (authUser && authUser._id) {
      const socket = io('http://localhost:5555', {
        withCredentials: true,
        transports: ['websocket'],
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      socket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
