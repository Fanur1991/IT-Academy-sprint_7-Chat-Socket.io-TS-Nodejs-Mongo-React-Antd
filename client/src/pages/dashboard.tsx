import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import {
  Layout,
  Menu,
  Typography,
  Flex,
  Avatar,
  Button,
  message,
  Input,
} from 'antd';
import type { MenuProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import Chat from '../components/Chat';
import { useAuthContext } from '../context/AuthContext';
import { useRoomContext } from '../context/RoomContext';
import UsersInfo from '../components/UsersInfo';
import { rooms } from '../data/data';
import { axiosInstance } from '../config/axios';
import { UserData } from '../types/types';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    _id: '',
    username: '',
    email: '',
    room: '',
  });
  const [avatarSeed, _setAvatarSeed] = useState(() => Math.random().toFixed(2));
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState([]);
  const { authUser } = useAuthContext();
  const { room, setRoom } = useRoomContext();
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = async (e: any) => {
    try {
      const response = await axiosInstance.patch(
        `/api/rooms`,
        { room: rooms.map(room => room.name)[parseInt(e.key)] },
        {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
          withCredentials: true,
        }
      );

      const stringifiedData = JSON.stringify(response.data);

      // Save the response data in session and cookie storages
      sessionStorage.setItem('userData', stringifiedData);
      Cookies.set('userData', stringifiedData);

      setRoom(response.data.room);

      message.success('Room changed');
    } catch (error: any) {
      console.error('Failed to change room:', error);
      message.error('Failed to change room');
    }
  };

  const items: MenuProps['items'] = rooms.map((room, index) => ({
    key: index.toString(),
    icon: room.icon,
    label: room.name,
  }));

  useEffect(() => {
    if (authUser) {
      setUserData(authUser);
      setRoom(authUser.room);
    } else {
      navigate('/login', { replace: true });
    }
  }, [authUser, setRoom]);

  const handleLogout = () => {
    Cookies.remove('userData');
    sessionStorage.clear();
    navigate('/login');
  };

  const handleSearch = async () => {
    try {
      if (searchValue.trim() === '') {
        setSearchResults([]);
        return;
      }

      const response = await axiosInstance.get('/api/search', {
        params: {
          room,
          query: searchValue,
        },
        withCredentials: true,
      });

      setSearchResults(response.data);
    } catch (error: any) {
      console.error('Failed to search messages:', error);
      message.error('Failed to search messages');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === '') {
      setSearchResults([]);
    }
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
            backgroundImage:
              'linear-gradient(180deg, #9973F8 10%, #BC4CDC 90%)',
          }}
          theme="light"
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          selectedKeys={[`${rooms.map(room => room.name).indexOf(room)}`]}
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
            columnGap: '50px',
          }}
        >
          <Input.Search
            style={{ width: '20%' }}
            size="small"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={`Search message in ${room}...`}
            onPressEnter={handleSearch}
            onSearch={handleSearch}
            suffix={
              <CloseOutlined
                style={{
                  cursor: 'pointer',
                  fontSize: '10px',
                  color: '#323232',
                }}
                onClick={() => {
                  setSearchValue('');
                  setSearchResults([]);
                }}
              />
            }
          />
          <Button
            type="link"
            style={{ marginRight: '64px', color: '#F5F5F5' }}
            onClick={handleLogout}
          >
            Logout
            <LogoutOutlined />
          </Button>
        </Header>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '0px',
            margin: '0px 0px 0',
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
            }}
          >
            <Chat searchResults={searchResults} />
          </div>
          <div
            style={{
              padding: 24,
              height: '100%',
              width: '25%',
              background: '#ffd6e7',
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
