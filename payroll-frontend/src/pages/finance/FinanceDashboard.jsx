import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Button, DatePicker, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FinanceService from '../../services/financeService';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const FinanceDashboard = () => {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filterDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: filterDate[0].format('YYYY-MM-DD'),
        endDate: filterDate[1].format('YYYY-MM-DD')
      };
      
      const [summaryData, transactionsData] = await Promise.all([
        FinanceService.getFinancialSummary(params),
        FinanceService.getTransactions(params)
      ]);
      
      setSummary(summaryData.data);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setFilterDate(dates);
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'income' ? 'green' : type === 'salary' ? 'blue' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text strong type={record.type === 'income' ? 'success' : 'danger'}>
          {record.type === 'income' ? '+' : '-'}{formatCurrency(amount)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <Title level={3}>Finance Dashboard</Title>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="Total Income" bordered={false}>
            <Title level={2} style={{ color: 'green' }}>
              {formatCurrency(summary.totalIncome || 0)}
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Expenses" bordered={false}>
            <Title level={2} style={{ color: 'red' }}>
              {formatCurrency(summary.totalExpenses || 0)}
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Balance" bordered={false}>
            <Title level={2} style={{ 
              color: (summary.balance || 0) >= 0 ? 'green' : 'red' 
            }}>
              {formatCurrency(summary.balance || 0)}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Transactions</span>
            <RangePicker 
              defaultValue={filterDate}
              onChange={handleDateChange}
              style={{ width: 250 }}
            />
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/finance/transactions/add')}
          >
            Add Transaction
          </Button>
        }
      >
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default FinanceDashboard;