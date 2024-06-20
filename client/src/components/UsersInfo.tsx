import { Flex, List, Typography, Tag } from 'antd';
import { GoDotFill } from 'react-icons/go';
import { useSocketContext } from '../context/SocketContext';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../config/axios';
import { IUser } from '../types/types';
import { useRoomContext } from '../context/RoomContext';

const { Text } = Typography;

const UsersInfo: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { onlineUsers } = useSocketContext();
  const { room } = useRoomContext();

  useEffect(() => {
    if (room) {
      getAllUsers();
    }
  }, [room]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users', {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Expected an array of users');
      }
    } catch (error: any) {}
  };

  const onlineUsernames = users.filter(user => onlineUsers.includes(user._id));
  const offlineUsernames = users.filter(
    user => !onlineUsers.includes(user._id)
  );

  return (
    <Flex
      style={{
        backgroundColor: '#F0F2F5',
        borderRadius: 8,
        padding: 10,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
      justify="center"
      align="start"
      vertical
    >
      <Flex justify="center" align="center">
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
          Room: <Text style={{ fontSize: 12, fontWeight: 450 }}>{room}</Text>
        </Text>
      </Flex>
      <Flex justify="center" align="center">
        <GoDotFill
          style={{ padding: 0, margin: 0 }}
          size={14}
          color="#237804"
        />
        <Text style={{ fontSize: 12 }}>Online users:</Text>
      </Flex>
      <List
        style={{ width: '100%' }}
        dataSource={onlineUsernames}
        renderItem={item => (
          <Flex justify="center" align="start" vertical>
            <Tag
              color="success"
              style={{ marginLeft: 15, fontSize: 12, marginBottom: 3 }}
            >
              {item.username}
            </Tag>
          </Flex>
        )}
      />
      <Flex justify="center" align="center">
        <GoDotFill
          style={{ padding: 0, margin: 0 }}
          size={14}
          color="#a8071a"
        />
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Offline users:</Text>
      </Flex>
      <List
        style={{ width: '100%', marginTop: 3 }}
        dataSource={offlineUsernames}
        renderItem={item => (
          <Flex justify="center" align="start" vertical>
            <Tag
              color="error"
              style={{ marginLeft: 15, fontSize: 12, marginBottom: 3 }}
            >
              {item.username}
            </Tag>
          </Flex>
        )}
      />
    </Flex>
  );
};

export default UsersInfo;
