import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentOutlined, LogoutOutlined } from '@ant-design/icons';
import {
  Layout,
  Menu,
  theme,
  Typography,
  Flex,
  Avatar,
  Button,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import Cookies from 'js-cookie';
import Chat from '../components/Chat';
import { useAuthContext } from '../context/AuthContext';
import UsersInfo from '../components/UsersInfo';
import { rooms } from './AuthPage';
import { axiosInstance } from '../config/axios';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

type UserData = {
  _id: string;
  username: string;
  email: string;
  room: string;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    _id: '',
    username: '',
    email: '',
    room: '',
  });
  const [room, setRoom] = useState<string>('');
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toFixed(2));
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = async (e: any) => {
    try {
      const response = await axiosInstance.patch(
        `/api/rooms`,
        { room: rooms[parseInt(e.key)] },
        {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
          withCredentials: true,
        }
      );

      console.log('Room changed successfully:', response.data.room);

      sessionStorage.setItem('userData', JSON.stringify(response.data));
      Cookies.set('userData', JSON.stringify(response.data));

      setRoom(response.data.room);

      message.success('Room changed successfully');
    } catch (error: any) {
      console.error('Failed to change room:', error);
      message.error('Failed to change room');
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'First',
      icon: <CommentOutlined />,
      label: room,
      children: rooms.map((room, index) => ({
        key: index.toString(),
        label: room,
      })),
    },
  ];

  useEffect(() => {
    if (authUser) {
      setUserData(authUser);
      setRoom(authUser.room);
    } else {
      navigate('/login', { replace: true });
    }
  }, [authUser, setRoom]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            height: 34,
            margin: 16,
          }}
        >
          <Flex align="center" justify="center" gap="10px">
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${avatarSeed}`}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '400',
                color: '#F5F5F5',
              }}
            >
              {userData?.username.length > 10
                ? `${userData?.username.slice(0, 10).concat('...')}`
                : userData?.username}
            </Text>
          </Flex>
        </div>
        <Menu
          style={{
            backgroundImage:
              'linear-gradient(180deg, #9973F9 10%, #9C6FF6 90%)',
          }}
          theme="light"
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            padding: '0',
            overflow: 'initial',
          }}
        >
          <Button
            type="link"
            style={{ marginRight: '64px', color: '#F5F5F5' }}
            onClick={() => {
              Cookies.remove('userData');
              sessionStorage.clear();
              navigate('/login');
            }}
          >
            Logout
            <LogoutOutlined />
          </Button>
        </Header>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            margin: '24px 16px 0',
            overflow: 'initial',
            borderRadius: 10,
          }}
        >
          <div
            style={{
              padding: 24,
              height: '100%',
              width: '75%',
              background: '#efdbff',
              borderRadius: borderRadiusLG,
            }}
          >
            <Chat />
          </div>
          <div
            style={{
              padding: 24,
              height: '100%',
              width: '20%',
              background: '#ffd6e7',
              borderRadius: borderRadiusLG,
            }}
          >
            <UsersInfo />
          </div>
        </Content>
        <Footer style={{ overflow: 'initial', textAlign: 'center' }}>
          <span style={{ color: '#DA007F' }}>IT Academy de Barcelona</span> ©
          {new Date().getFullYear()} Created by FanurKh
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
