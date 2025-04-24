import { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Button,
  Card,
  Typography,
  message,
  Popconfirm,
  DatePicker,
  Select,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import PayrollService from '../../services/payrollService';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterParams, setFilterParams] = useState({
    status: null,
    dateRange: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayrolls();
  }, [filterParams]);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      let params = {};
      if (filterParams.status) params.status = filterParams.status;
      if (filterParams.dateRange) {
        params.startDate = filterParams.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filterParams.dateRange[1].format('YYYY-MM-DD');
      }

      const data = await PayrollService.getAllPayrolls(params);
      setPayrolls(data);
    } catch (error) {
      message.error('Failed to fetch payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await PayrollService.deletePayroll(id);
      message.success('Payroll record deleted successfully');
      fetchPayrolls();
    } catch (error) {
      message.error(
        error.message || error.error || 'Failed to delete payroll record'
      );
      console.error('Delete error:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilterParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Payroll Report', 14, 15);

    const tableData = payrolls.map((p, index) => [
      index + 1,
      p.employee?.fullName || '',
      p.employee?.employeeId || '',
      `${p.month}/${p.year}`,
      formatCurrency(p.basicSalary),
      formatCurrency(p.netSalary),
      p.status.toUpperCase()
    ]);

    autoTable(doc, {
      head: [['#', 'Employee Name', 'ID', 'Period', 'Basic Salary', 'Net Salary', 'Status']],
      body: tableData,
      startY: 25
    });

    doc.save('payroll-report.pdf');
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: ['employee', 'fullName'],
      key: 'employee',
      render: (text, record) => (
        <span>
          {text} ({record.employee?.employeeId})
        </span>
      )
    },
    {
      title: 'Period',
      dataIndex: 'month',
      key: 'period',
      render: (month, record) => `${month}/${record.year}`
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: formatCurrency
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      render: formatCurrency
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'paid') color = 'green';
        if (status === 'processed') color = 'blue';
        if (status === 'pending') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          
          <Popconfirm
            title="Are you sure to delete this payroll record?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Payroll Management</Title>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/payroll/add')}
            style={{ marginRight: 8 }}
          >
            Generate Payroll
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <RangePicker
            style={{ marginRight: 8, width: 250 }}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
          />
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 120, marginRight: 8 }}
            onChange={(value) => handleFilterChange('status', value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="processed">Processed</Option>
            <Option value="paid">Paid</Option>
          </Select>
          <Button type="primary" onClick={fetchPayrolls}>
            Filter
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={payrolls}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default PayrollList;
