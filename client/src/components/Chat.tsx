import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Flex } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthContext } from '../context/AuthContext';
import { IUser, IChatProps, IMessage } from '../types/types';

const Chat: React.FC<IChatProps> = ({ room }) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const { authUser } = useAuthContext();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<IUser>({
    _id: '',
    username: '',
    email: '',
    room: [],
  });

  console.log('Messages: ', messages);

  useEffect(() => {
    console.log('Room on mount:', room);
  }, []);

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

    if (socket) {
      socket.on('room_history', (messages: IMessage[]) => {
        setMessages(messages);
      });

      socket.on('receive_message', (message: IMessage) => {
        console.log('Message received: ', message);
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current!.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage && socket) {
      const effectiveRoom = room || 'default';
      console.log('Sending message: ', {
        room: effectiveRoom,
        message: inputMessage,
        user: userData.username,
      });

      socket.emit('send_message', {
        text: inputMessage,
        senderId: userData._id,
        room: room || 'default',
      });

      setInputMessage('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
      }}
    >
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}: </strong>
            {msg.text}
          </p>
        ))}
        <div ref={messageEndRef} />
      </div>
      <Flex
        justify="center"
        align="center"
        style={{ width: '80%' }}
        gap="middle"
      >
        <Input
          style={{ width: '100%' }}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Enter message"
          onPressEnter={sendMessage}
        />
        <Button type="primary" onClick={sendMessage}>
          <SendOutlined style={{ color: 'white' }} />
        </Button>
      </Flex>
    </div>
  );
};

export default Chat;
