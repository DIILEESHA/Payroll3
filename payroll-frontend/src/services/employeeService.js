import api from './api';

const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch employees' 
    };
  }
};

const getEmployee = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch employee' 
    };
  }
};

const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/employees', employeeData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to create employee' 
    };
  }
};

// In EmployeeService.js
const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to delete employee' 
    };
  }
};

const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to update employee' 
    };
  }
};

export default {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};