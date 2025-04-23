import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Select, DatePicker, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import FinanceService from '../../services/financeService';
import EmployeeService from '../../services/employeeService';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TransactionForm = () => {
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
      fetchTransaction();
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

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const transaction = await FinanceService.getTransaction(id);
      form.setFieldsValue({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        reference: transaction.reference,
        relatedEmployee: transaction.relatedEmployee?._id,
        status: transaction.status,
        date: dayjs(transaction.date)
      });
    } catch (error) {
      message.error('Failed to fetch transaction data');
      navigate('/finance');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        date: values.date.toISOString()
      };

      if (isEdit) {
        await FinanceService.updateTransaction(id, payload);
        message.success('Transaction updated successfully');
      } else {
        await FinanceService.createTransaction(payload);
        message.success('Transaction created successfully');
      }
      navigate('/finance');
    } catch (error) {
      message.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</Title>
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              type: 'expense',
              status: 'pending',
              date: dayjs()
            }}
          >
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select type!' }]}
            >
              <Select>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
                <Option value="refund">Refund</Option>
                <Option value="salary">Salary Payment</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please input amount!' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="reference"
              label="Reference"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="relatedEmployee"
              label="Related Employee"
            >
              <Select placeholder="Select employee (if applicable)">
                {employees.map(emp => (
                  <Option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeId})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
                <Option value="failed">Failed</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => navigate('/finance')}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default TransactionForm;