import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Flex, Card, List, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import { IChatProps, IMessage } from '../types/types';

const { Text } = Typography;

const Chat: React.FC<IChatProps> = ({ room }) => {
  // const [socket, setSocket] = useState<any>(null);
  // const socketRef = useRef(socket);
  // const [messages, setMessages] = useState<IMessage[]>([]);
  // const [inputMessage, setInputMessage] = useState<string>('');
  // const { authUser } = useAuthContext();
  // const { socket } = useSocketContext();
  // const messageEndRef = useRef<HTMLDivElement | null>(null);

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  console.log('socket', socket);

  // useEffect(() => {
  //   if (!authUser || !authUser._id) return;

  //   if (!socketRef.current) {
  //     const newSocket = io('http://localhost:5555', {
  //       withCredentials: true,
  //       transports: ['websocket'],
  //       query: { userId: authUser._id },
  //     });

  //     setSocket(newSocket);

  //     newSocket.on('connect', () => {
  //       console.log('Socket connected:', newSocket.id);
  //     });

  //     socketRef.current = newSocket;

  //     newSocket.on('room_history', (receivedMessages: IMessage[]) => {
  //       setMessages(receivedMessages);
  //     });

  //     newSocket.on('receive_message', (message: IMessage) => {
  //       console.log('Message received: ', message);
  //       setMessages(prevMessages => [...prevMessages, message]);
  //     });

  //     newSocket.emit('join_room', room);

  //     return () => {
  //       newSocket.close();
  //       socketRef.current = null;
  //     };
  //   }
  // }, [authUser, room]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('room_history', (receivedMessages: IMessage[]) => {
        setMessages(receivedMessages);
      });

      socket.on('receive_message', (message: IMessage) => {
        console.log('Message received: ', message);
        setMessages(prevMessages => [...prevMessages, message]);
      });

      socket.emit('join_room', room);

      return () => {
        socket.off('connect');
        socket.off('room_history');
        socket.off('receive_message');
      };
    }
  }, [socket, room]);

  // useEffect(() => {
  //   if (messageEndRef.current) {
  //     messageEndRef.current!.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current!.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // const sendMessage = () => {
  //   if (inputMessage && socket) {

  //     socket.emit('send_message', {
  //       text: inputMessage,
  //       senderId: authUser?._id,
  //       username: authUser?.username,
  //       room,
  //     });

  //     setInputMessage('');
  //   }
  // };

  const sendMessage = () => {
    if (inputMessage && socket && authUser) {
      const messageData = {
        text: inputMessage,
        senderId: authUser._id,
        username: authUser.username,
        room,
        createdAt: new Date().toISOString(),
      };

      socket.emit('send_message', messageData);

      setMessages(prevMessages => [...prevMessages, messageData]);

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
        // overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '75%',
          flexGrow: 1,
          overflowY: 'auto',
          maxHeight: '65vh',
        }}
      >
        <List
          dataSource={messages}
          renderItem={(msg, index) => (
            <List
              style={{
                display: 'flex',
                justifyContent:
                  msg.senderId === authUser?._id ? 'flex-end' : 'flex-start',
                padding: '10px',
              }}
            >
              <Card
                style={{
                  maxWidth: '100%',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  border: 'none',
                }}
              >
                <Text
                  style={{
                    color:
                      msg.senderId === authUser?._id ? '#eb2f96' : '#722ed1',
                    fontSize: '12px',
                  }}
                >
                  {msg.username}
                </Text>
                <br />
                <Text style={{ fontSize: '14px' }}>{msg.text}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}{' '}
                  | {new Date(msg.createdAt).toLocaleDateString()}
                </Text>
              </Card>
            </List>
          )}
        />

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
