import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider, useAuth } from './utils/auth';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import PayrollList from './pages/payroll/PayrollList';
import PayrollForm from './pages/payroll/PayrollForm';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import TransactionForm from './pages/finance/TransactionForm';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import './App.css';

const { Content } = Layout;

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure the user has a role and it's checked against 'admin'
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


function AppContent() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/employees" element={
                <ProtectedRoute adminOnly>
                  <EmployeeList />
                </ProtectedRoute>
              } />
              <Route path="/employees/add" element={
                <ProtectedRoute adminOnly>
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              <Route path="/employees/edit/:id" element={
                <ProtectedRoute adminOnly>
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              
              <Route path="/payroll" element={
                <ProtectedRoute adminOnly>
                  <PayrollList />
                </ProtectedRoute>
              } />
              
              <Route path="/payroll/add" element={
                <ProtectedRoute adminOnly>
                  <PayrollForm />
                </ProtectedRoute>
              } />
              
              <Route path="/payroll/edit/:id" element={
                <ProtectedRoute adminOnly>
                  <PayrollForm />
                </ProtectedRoute>
              } />
              
              <Route path="/finance" element={
                <ProtectedRoute adminOnly>
                  <FinanceDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/finance/transactions/add" element={
                <ProtectedRoute adminOnly>
                  <TransactionForm />
                </ProtectedRoute>
              } />
              
              <Route path="/finance/transactions/edit/:id" element={
                <ProtectedRoute adminOnly>
                  <TransactionForm />
                </ProtectedRoute>
              } />
              
              {/* Error Routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;