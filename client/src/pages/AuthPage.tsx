import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Tabs,
  Typography,
  message,
  Select,
  Divider,
  Flex,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import getGoogleOauthUrl from '../utils/getGoogleUrl';
import Cookies from 'js-cookie';
import { axiosInstance } from '../config/axios';
import { rooms } from '../data/customIcons';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('register');
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/api/login', values);

      console.log('Login successful:', response.data.user);

      sessionStorage.setItem('userData', JSON.stringify(response.data.user));

      Cookies.set('userData', JSON.stringify(response.data.user));

      message.success('Login successful');

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to login');
    }
  };

  const handleRegister = async (values: {
    username: string;
    email: string;
    room: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post('/api/register', values);

      console.log('Registration successful:', response.data);

      sessionStorage.setItem(
        'userData',
        JSON.stringify({ ...response.data.user, room: values.room })
      );

      Cookies.set('userData', JSON.stringify(response.data.user));

      message.success('Registration successful');

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Failed to register');
    }
  };

  return (
    <div style={{ width: '350px', margin: '100px auto' }}>
      <Flex justify="center">
        <Title
          style={{
            fontFamily: 'Oswald',
            color: '#9873f8',
            textAlign: 'center',
          }}
          level={3}
        >
          Let's Chat
        </Title>
        <img width={35} height={35} src="../../public/chatting.svg" />
      </Flex>
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="login"
        onChange={key => setActiveTab(key)}
      >
        <TabPane tab="Login" key="login">
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', height: 55 }}
              >
                Log in 🚀
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Register" key="register">
          <Form name="register_form" onFinish={handleRegister}>
            <Form.Item name="username">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="room"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select allowClear showSearch placeholder="Select room">
                {rooms.map((room, index) => (
                  <Option key={index}>{room.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', height: 55, color: 'white' }}
              >
                Sign up 🚀
              </Button>
            </Form.Item>
            <Divider
              children="Or with google account"
              type="horizontal"
              orientation="center"
            />
            <Form.Item>
              <Button
                href={getGoogleOauthUrl()}
                style={{ width: '100%', height: '55px' }}
              >
                <img
                  style={{ width: 40, height: 40 }}
                  src="../../public/google_icon.svg"
                  alt="Google Login"
                />
                Sign in with Google
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AuthPage;
