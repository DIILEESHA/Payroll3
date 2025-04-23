import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Select, DatePicker, message, Spin, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import PayrollService from '../../services/payrollService';
import EmployeeService from '../../services/employeeService';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';

const { Title } = Typography;
const { Option } = Select;

const PayrollForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    fetchEmployees();
    if (isEdit) {
      fetchPayroll();
    }
  }, [id]);

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Failed to fetch employees');
    }
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const payroll = await PayrollService.getPayroll(id);
      form.setFieldsValue({
        employee: payroll.employee._id,
        month: dayjs().month(payroll.month - 1).year(payroll.year),
        basicSalary: payroll.basicSalary,
        allowances: payroll.allowances,
        deductions: payroll.deductions,
        tax: payroll.tax,
        status: payroll.status
      });
    } catch (error) {
      message.error('Failed to fetch payroll data');
      navigate('/payroll');
    } finally {
      setLoading(false);
    }
  };

  const calculateNetSalary = () => {
    const values = form.getFieldsValue();
    const basicSalary = values.basicSalary || 0;
    const allowances = values.allowances || 0;
    const deductions = values.deductions || 0;
    const tax = values.tax || 0;
    return basicSalary + allowances - deductions - tax;
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        month: values.month.month() + 1, // JavaScript months are 0-indexed
        year: values.month.year(),
        netSalary: calculateNetSalary()
      };

      if (isEdit) {
        await PayrollService.updatePayroll(id, payload);
        message.success('Payroll updated successfully');
      } else {
        await PayrollService.createPayroll(payload);
        message.success('Payroll created successfully');
      }
      navigate('/payroll');
    } catch (error) {
      message.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>{isEdit ? 'Edit Payroll' : 'Create Payroll'}</Title>
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              month: dayjs(),
              basicSalary: 0,
              allowances: 0,
              deductions: 0,
              tax: 0,
              status: 'pending'
            }}
          >
            <Form.Item
              name="employee"
              label="Employee"
              rules={[{ required: true, message: 'Please select employee!' }]}
            >
              <Select placeholder="Select employee" disabled={isEdit}>
                {employees.map(emp => (
                  <Option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeId})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="month"
              label="Month/Year"
              rules={[{ required: true, message: 'Please select month/year!' }]}
            >
              <DatePicker picker="month" style={{ width: '100%' }} />
            </Form.Item>

            <Divider orientation="left">Salary Details</Divider>

            <Form.Item
              name="basicSalary"
              label="Basic Salary"
              rules={[{ required: true, message: 'Please input basic salary!' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="allowances"
              label="Allowances"
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="deductions"
              label="Deductions"
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="tax"
              label="Tax"
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              label="Net Salary"
            >
              <Input 
                value={formatCurrency(calculateNetSalary())} 
                prefix="$" 
                readOnly 
                style={{ fontWeight: 'bold' }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Option value="pending">Pending</Option>
                <Option value="processed">Processed</Option>
                <Option value="paid">Paid</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => navigate('/payroll')}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default PayrollForm;