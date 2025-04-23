import { Layout, Dropdown, Avatar, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../utils/auth';

const { Header } = Layout;

const AppHeader = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();

  const items = [
    {
      key: '1',
      label: (
        <span onClick={logout}>
          <LogoutOutlined /> Logout
        </span>
      ),
    }
  ];

  return (
    <Header style={{ padding: 0, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Dropdown menu={{ items }} placement="bottomRight">
          <div style={{ paddingRight: 24, cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <span>{user?.fullName}</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;