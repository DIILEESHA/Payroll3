import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await AuthService.register(values);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 50 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Register</Title>
        <Form
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="employeeId"
            rules={[{ required: true, message: 'Please input employee ID!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Employee ID" />
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input phone number!' },
              { pattern: /^\d{10,15}$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="salary"
            rules={[{ required: true, message: 'Please input salary!' }]}
          >
            <Input type="number" prefix="$" placeholder="Salary" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login now</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;