import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Typography, Flex, Avatar, Button } from 'antd';
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

type UserData = {
  _id: string;
  username: string;
  email: string;
  room: string[];
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    _id: '',
    username: '',
    email: '',
    room: [],
  });
  const [token, setToken] = useState<string>(
    sessionStorage.getItem('token') || ''
  );
  const [userId, setUserId] = useState<string>(
    sessionStorage.getItem('userId') || ''
  );
  const [room, setRoom] = useState<string>(
    sessionStorage.getItem('room') || ''
  );
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toFixed(2));
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    {
      key: '1',
      icon: <CommentOutlined />,
      label: `${room || 'default'}`,
      path: '/',
    },
  ];

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const response = await axios.get(
          `http://localhost:5555/api/users/${userId}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );

        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to fetch room:', error);
      }
    };

    if (!token) {
      navigate('/login');
    }

    fetchUserData();
  }, [token, navigate]);

  const handleMenuClick = (item: any) => {
    navigate(item.path);
  };

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
            backgroundImage: 'linear-gradient(180deg, #9873f8 5%, #A467F0 95%)',
          }}
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items.map(item => ({
            ...item,
            onClick: () => handleMenuClick(item),
          }))}
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
              sessionStorage.clear();
              navigate('/login', { replace: true });
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
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Content
          </div>
          <div
            style={{
              padding: 24,
              height: '100%',
              width: '20%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            sider
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
