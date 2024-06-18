import { Flex, List, Typography } from 'antd';
import { GoDotFill } from 'react-icons/go';
import { useAuthContext } from '../context/AuthContext';

const { Text } = Typography;

const UsersInfo: React.FC = () => {
  const { authUser } = useAuthContext();

  const users = ['user1', 'user2', 'user3', 'user4', 'user5'];

  return (
    <Flex
      style={{
        backgroundColor: '#F0F2F5',
        borderRadius: 5,
        padding: 10,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
      justify="center"
      align="start"
      vertical
    >
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
        dataSource={users}
        renderItem={item => (
          <Flex justify="center" align="center" vertical>
            <Text style={{ fontSize: 12 }}>{item}</Text>
          </Flex>
        )}
      />
      <Flex justify="center" align="center">
        <GoDotFill
          style={{ padding: 0, margin: 0 }}
          size={14}
          color="#a8071a  "
        />
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Offline users:</Text>
      </Flex>
      <List
        style={{ width: '100%' }}
        dataSource={users}
        renderItem={item => (
          <Flex justify="center" align="center" vertical>
            <Text style={{ fontSize: 12, color: '#8c8c8c' }}>{item}</Text>
          </Flex>
        )}
      />
    </Flex>
  );
};

export default UsersInfo;
