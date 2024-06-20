import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Flex,
  Card,
  List,
  Typography,
  Dropdown,
  Menu,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import { useRoomContext } from '../context/RoomContext';
import { IMessage, IChatProps } from '../types/types';
import { SmileIcon } from '../data/customIcons';
import { emojis } from '../data/customIcons';
import type { MenuProps } from 'antd';

const { Text } = Typography;

const Chat: React.FC<IChatProps> = ({ searchResults }) => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { room } = useRoomContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Creating menu items for dropdown emojis
  const items: MenuProps['items'] = emojis.map((emoji, index) => ({
    label: <span onClick={() => handleEmojiClick(emoji)}>{emoji}</span>,
    key: index.toString(),
  }));

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  const emojiMenu = (
    <Menu
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '5px',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
      items={items}
    />
  );

  useEffect(() => {
    if (socket && room) {
      socket.on('roomHistory', (receivedMessages: IMessage[]) => {
        setMessages(receivedMessages);
      });

      socket.on('receiveMessage', (message: IMessage) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      socket.emit('joinRoom', room);

      return () => {
        socket.off('connect');
        socket.off('roomHistory');
        socket.off('receiveMessage');
      };
    }
  }, [socket, room]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current!.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, searchResults]);

  const sendMessage = () => {
    if (inputMessage && socket && authUser && room) {
      const messageData = {
        text: inputMessage,
        senderId: authUser._id,
        username: authUser.username,
        room: room,
      };

      socket.emit('sendMessage', messageData);

      setInputMessage('');
    }
  };

  const displayedMessages = searchResults.length > 0 ? searchResults : messages;

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
        borderRadius: '8px',
        background: '#f0f2f5',
        padding: '10px',
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
          dataSource={displayedMessages}
          renderItem={(msg, index) => (
            <List
              style={{
                display: 'flex',
                justifyContent:
                  msg.senderId === authUser?._id ? 'flex-end' : 'flex-start',
                padding: '7px',
              }}
            >
              <Card
                key={index}
                style={{
                  maxWidth: '100%',
                  borderRadius: '10px',
                  background: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  border: 'none',
                  padding: '0 12px',
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
          prefix=""
          style={{ width: '100%' }}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Enter message..."
          onPressEnter={sendMessage}
          suffix={
            <Dropdown
              overlay={emojiMenu}
              trigger={['click']}
              placement="topCenter"
            >
              <SmileIcon style={{ color: '#722ed1', cursor: 'pointer' }} />
            </Dropdown>
          }
        />
        <Button type="primary" onClick={sendMessage}>
          <SendOutlined style={{ color: '#ffffff' }} />
        </Button>
      </Flex>
    </div>
  );
};

export default Chat;
