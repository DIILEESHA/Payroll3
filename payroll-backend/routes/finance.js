// routes/finance.js
const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary
} = require('../controllers/financeController');

router.route('/transactions')
  .get(getTransactions)
  .post(createTransaction);

router.route('/transactions/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

router.route('/summary')
  .get(getFinancialSummary);

module.exports = router;