import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Tabs,
  Typography,
  ConfigProvider,
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
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

const rooms = [
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'SASS',
  'Ant Design',
  'React',
  'NodeJS',
  'Express',
  'NextJS',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Git',
  'Docker',
  'Jest',
  'TDD',
];

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('register');
  const navigate = useNavigate();

  const handleLogin = async (values: {
    email: string;
    password: string;
    room: string;
  }) => {
    try {
      const response = await axios.post('http://localhost:5555/login', {
        email: values.email,
        password: values.password,
        room: values.room,
      });

      console.log('Login successful:', response.data.user);
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('userId', response.data.user._id);
      localStorage.setItem('room', values.room);

      message.success('Login successful');

      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Login error:', error.response.data);
        message.error(error.response.data.message);
      } else {
        console.log('Unexpected error:', error);
      }
    }
  };

  const handleRegister = async (values: {
    username: string;
    email: string;
    room: string;
    password: string;
  }) => {
    try {
      const response = await axios.post('http://localhost:5555/register', {
        username: values.username,
        email: values.email,
        room: values.room,
        password: values.password,
      });
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('userId', response.data.user._id);
      localStorage.setItem('room', values.room);

      message.success('Registration successful');

      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Registration error:', error.response.data);
        message.error(error.response.data.message);
      } else {
        console.log('Unexpected error:', error);
      }
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
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemSelectedColor: '#B37FEB',
              inkBarColor: '#B37FEB',
            },
          },
        }}
      >
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
                rules={[
                  { required: true, message: 'Please input your Email!' },
                ]}
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
                  {rooms.map(room => (
                    <Option key={room}>{room}</Option>
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
                  style={{ width: '100%', height: 55 }}
                >
                  Log in
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
                rules={[
                  { required: true, message: 'Please input your Email!' },
                ]}
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
                  {rooms.map(room => (
                    <Option key={room}>{room}</Option>
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
                  style={{ width: '100%', height: 55 }}
                >
                  Register
                </Button>
              </Form.Item>
              <Divider
                children="Or with google account"
                type="horizontal"
                orientation="center"
              />
              <Form.Item>
                <GoogleLoginButton />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
};

export default AuthPage;
