import { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, DatePicker, Tag, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FinanceService from '../../services/financeService';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
        endDate: filterDate[1].format('YYYY-MM-DD'),
      };
      const [summaryData, transactionsData] = await Promise.all([
        FinanceService.getFinancialSummary(params),
        FinanceService.getTransactions(params),
      ]);
      setSummary(summaryData.data);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await FinanceService.deleteTransaction(id);
      message.success('Transaction deleted successfully');
      await fetchData(); // Refresh data after delete
    } catch (error) {
      console.error('Delete error:', error);
      message.error(
        error.message || 
        error.error || 
        'Failed to delete transaction'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setFilterDate(dates);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transactions Report', 14, 22);
    
    // Add date range
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(
      `Date Range: ${filterDate[0].format('DD/MM/YYYY')} - ${filterDate[1].format('DD/MM/YYYY')}`,
      14,
      30
    );
    
    // Prepare data for the table
    const tableData = transactions.map((transaction) => [
      dayjs(transaction.date).format('DD/MM/YYYY'),
      transaction.type.toUpperCase(),
      transaction.description,
      `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`,
      transaction.status.toUpperCase(),
    ]);
    
    // Add table using autoTable
    doc.autoTable({
      head: [['Date', 'Type', 'Description', 'Amount', 'Status']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Generated on ${dayjs().format('DD/MM/YYYY HH:mm')}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });
    
    // Save the PDF
    doc.save(`transactions-report-${dayjs().format('YYYY-MM-DD')}.pdf`);
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'income' ? 'green' : type === 'salary' ? 'blue' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text strong type={record.type === 'income' ? 'success' : 'danger'}>
          {record.type === 'income' ? '+' : '-'}
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this transaction?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Finance Dashboard</Title>

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
          <Space>
            {/* <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              disabled={transactions.length === 0}
            >
              Export PDF
            </Button> */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/finance/transactions/add')}
            >
              Add Transaction
            </Button>
          </Space>
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