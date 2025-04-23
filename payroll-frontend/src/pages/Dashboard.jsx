import { Card, Row, Col, Typography, Statistic, Alert } from 'antd';
import { TeamOutlined, DollarOutlined, TransactionOutlined } from '@ant-design/icons';
import { useAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Alert
          message="Access Denied"
          description="You must be an administrator to view this page."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Employees"
              value={125}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Monthly Payroll"
              value={125000}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Transactions"
              value={42}
              prefix={<TransactionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Quick Actions">
        <Row gutter={16}>
          <Col span={8}>
            <Card hoverable onClick={() => navigate('/employees')}>
              <Title level={4} style={{ textAlign: 'center' }}>
                <TeamOutlined /> Manage Employees
              </Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable onClick={() => navigate('/payroll')}>
              <Title level={4} style={{ textAlign: 'center' }}>
                <DollarOutlined /> Process Payroll
              </Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable onClick={() => navigate('/transactions')}>
              <Title level={4} style={{ textAlign: 'center' }}>
                <TransactionOutlined /> Record Transaction
              </Title>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;