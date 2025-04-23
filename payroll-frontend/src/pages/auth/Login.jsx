import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { useAuth } from '../../utils/auth';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Dummy admin credentials (in production, use environment variables)
  const ADMIN_CREDENTIALS = {
    email: 'admin@payroll.com',
    password: 'admin123'
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Check if it's the admin login
      if (values.email === ADMIN_CREDENTIALS.email && 
          values.password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          _id: 'admin-dummy-id',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
          fullName: 'System Administrator'
        };
        login(adminUser);
        message.success('Admin login successful');
        navigate('/');  // Changed from '/dashboard' to '/'
        return;
      }

      // Regular user login
      const user = await AuthService.login(values);
      login(user);
      message.success('Login successful');
      navigate('/');  // Changed all redirects to go to root
    } catch (error) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 50 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Login</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          {/* Don't have an account? <Link to="/register">Register now</Link> */}
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <small>Admin access: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</small>
        </div>
      </Card>
    </div>
  );
};

export default Login;