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
  try {
    const response = await api.put(`/payroll/${id}`, payrollData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to update payroll' 
    };
  }
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

const getPayroll = async (id) => {
  try {
    console.log('Making request to:', `/payroll/${id}`);
    const response = await api.get(`/payroll/${id}`);
    console.log('API response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch payroll' 
    };
  }
};
export default {
  getAllPayrolls,
  getEmployeePayrolls,
  createPayroll,
  getPayroll,  

  updatePayroll,
  deletePayroll
};