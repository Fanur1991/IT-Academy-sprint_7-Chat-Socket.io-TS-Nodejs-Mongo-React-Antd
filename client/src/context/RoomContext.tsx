import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RoomContextProps {
  room: string;
  setRoom: (room: string) => void;
}

const RoomContext = createContext<RoomContextProps | undefined>(undefined);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};

export const RoomProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<string>('');

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};
