import api from './api';

const getTransactions = async () => {
  const response = await api.get('/finance/transactions');
  return response.data.data;
};

const createTransaction = async (transactionData) => {
  const response = await api.post('/finance/transactions', transactionData);
  return response.data.data;
};

const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/finance/transactions/${id}`, transactionData);
  return response.data.data;
};

const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/finance/transactions/${id}`);
    return response.data; // Changed from response.data.data to match backend
  } catch (error) {
    throw error.response?.data || { 
      message: error.message || 'Failed to delete transaction' 
    };
  }
};

const getFinancialSummary = async () => {
  const response = await api.get('/finance/summary');
  return response.data;
};

export default {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary
};