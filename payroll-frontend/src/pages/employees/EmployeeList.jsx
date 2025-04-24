/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Table, Space, Button, Card, Typography, message, Popconfirm, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/employeeService';
import { formatCurrency } from '../../utils/helpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title } = Typography;
const { Search } = Input;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await EmployeeService.getAllEmployees();
      const validatedData = data.map(emp => ({
        _id: emp._id,
        employeeId: emp.employeeId || '',
        fullName: emp.fullName || '',
        email: emp.email || '',
        salary: emp.salary || 0,
        role: emp.role || 'employee'
      }));
      setEmployees(validatedData);
    } catch (error) {
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await EmployeeService.deleteEmployee(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      message.error(error.message || 'Failed to delete employee');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Employee List', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Employee ID', 'Full Name', 'Email', 'Salary', 'Role']],
      body: filteredEmployees.map(emp => [
        emp.employeeId,
        emp.fullName,
        emp.email,
        `$${emp.salary.toLocaleString()}`,
        emp.role.toUpperCase()
      ])
    });
    doc.save('employee-list.pdf');
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchText) ||
    emp.email.toLowerCase().includes(searchText) ||
    emp.employeeId.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId)
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: formatCurrency,
      sorter: (a, b) => a.salary - b.salary
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) => a.role.localeCompare(b.role)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/employees/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this employee?"
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
        <Title level={3}>Employee Management</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/add')}
          >
            Add Employee
          </Button>
          <Button 
            type="default" 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </div>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search employees"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 400 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default EmployeeList;
