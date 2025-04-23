import api from './api';

const getAllPayrolls = async () => {
  const response = await api.get('/payroll');
  return response.data.data;
};

const getEmployeePayrolls = async (employeeId) => {
  const response = await api.get(`/payroll/employee/${employeeId}`);
  return response.data.data;
};

const createPayroll = async (payrollData) => {
  const response = await api.post('/payroll', payrollData);
  return response.data.data;
};

const updatePayroll = async (id, payrollData) => {
  const response = await api.put(`/payroll/${id}`, payrollData);
  return response.data.data;
};

const deletePayroll = async (id) => {
  try {
    const response = await api.delete(`/payroll/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to delete payroll' 
    };
  }
};

export default {
  getAllPayrolls,
  getEmployeePayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll
};