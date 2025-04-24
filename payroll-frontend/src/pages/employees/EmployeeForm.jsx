import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Select, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../../services/employeeService';

const { Title } = Typography;
const { Option } = Select;

const EmployeeForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 🔧 Auto-generate Employee ID
  const generateEmployeeId = () => {
    const timestamp = Date.now(); // Unique base
    const randomPart = Math.floor(Math.random() * 1000);
    return `EMP-${timestamp.toString().slice(-5)}${randomPart.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    } else {
      // Set auto-generated ID for new employee
      form.setFieldsValue({
        employeeId: generateEmployeeId(),
        role: 'employee'
      });
    }
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employee = await EmployeeService.getEmployee(id);
      form.setFieldsValue({
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        salary: employee.salary,
        role: employee.role
      });
    } catch (error) {
      message.error('Failed to fetch employee data');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await EmployeeService.updateEmployee(id, values);
        message.success('Employee updated successfully');
      } else {
        await EmployeeService.createEmployee(values);
        message.success('Employee created successfully');
      }
      navigate('/employees');
    } catch (error) {
      message.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const validatePassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!isEdit && (!value || value.length < 6)) {
        return Promise.reject(new Error('Password must be at least 6 characters!'));
      }
      return Promise.resolve();
    },
  });

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  return (
    <div>
      <Title level={3}>{isEdit ? 'Edit Employee' : 'Add Employee'}</Title>
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: 'Please input employee ID!' }]}
            >
              <Input placeholder="EMP-001" disabled />
            </Form.Item>

            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: 'Please input full name!' }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input phone number!' },
                { pattern: /^\d{10,15}$/, message: 'Please enter a valid phone number!' }
              ]}
            >
              <Input placeholder="1234567890" />
            </Form.Item>

            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: 'Please input salary!' }]}
            >
              <Input type="number" prefix="$" placeholder="50000" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select role!' }]}
            >
              <Select>
                <Option value="employee">Employee</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            {!isEdit && (
              <>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                    validatePassword
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm password!' },
                    validateConfirmPassword
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => navigate('/employees')}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default EmployeeForm;
