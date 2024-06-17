import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Flex } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthContext } from '../context/AuthContext';
import { IUser, IChatProps, IMessage } from '../types/types';

const Chat: React.FC<IChatProps> = ({ room }) => {
  const [socket, setSocket] = useState<any>(null);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const { authUser } = useAuthContext();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  // const [userData, setUserData] = useState<IUser>({
  //   _id: '',
  //   username: '',
  //   email: '',
  //   room: '',
  // });

  // console.log('authUser', authUser);

  // console.log('Messages: ', messages);
  // console.log('userDAta', authUser);

  // useEffect(() => {
  //   if (authUser) {
  //     setUserData(authUser);
  //   }
  // }, [authUser]);

  useEffect(() => {
    if (!authUser || !authUser._id) return;

    if (!socketRef.current) {
      const newSocket = io('http://localhost:5555', {
        withCredentials: true,
        transports: ['websocket'],
        query: { userId: authUser._id },
      });

      setSocket(newSocket);

      newSocket.on('room_history', (receivedMessages: IMessage[]) => {
        setMessages(receivedMessages);
      });

      newSocket.on('receive_message', (message: IMessage) => {
        console.log('Message received: ', message);
        setMessages(prevMessages => [...prevMessages, message]);
      });

      newSocket.emit('join_room', room);

      return () => {
        newSocket.close();
      };
    }
  }, [authUser, room]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current!.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage && socket) {
      console.log('Sending message: ', messages);

      socket.emit('send_message', {
        text: inputMessage,
        senderId: authUser?._id,
        username: authUser?.username,
        room,
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
