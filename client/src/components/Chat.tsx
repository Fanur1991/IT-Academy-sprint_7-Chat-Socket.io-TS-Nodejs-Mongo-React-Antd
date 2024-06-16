import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Flex } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthContext } from '../context/AuthContext';
import { IUser, IChatProps, IMessage } from '../types/types';

const Chat: React.FC<IChatProps> = ({ room }) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { authUser } = useAuthContext();
  const [userData, setUserData] = useState<IUser>({
    _id: '',
    username: '',
    email: '',
    room: [],
  });

  useEffect(() => {
    if (authUser) {
      setUserData(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    const socket = io('http://localhost:5555', {
      withCredentials: true,
      transports: ['websocket'],
    });
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [room]);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', room);

      socket.on('receive_message', (message: any) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }
  }, [socket, room]);

  const sendMessage = (message: string) => {
    if (message && socket) {
      socket.emit('send_message', { room, message, user: userData.username });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '10px',
      }}
    >
      <Flex style={{ width: '80%', height: '95%' }} vertical>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.username}: {msg.text}
            </li>
          ))}
        </ul>
      </Flex>
      <Flex justify="center" align="center" gap="middle">
        <Input style={{ width: '50%' }} placeholder="Enter message" />
        <Button type="primary" onClick={() => sendMessage('Hello World!')}>
          <SendOutlined style={{ color: 'white' }} />
        </Button>
      </Flex>
    </div>
  );
};

export default Chat;
