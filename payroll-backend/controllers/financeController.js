// backend/controllers/financeController.js
const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc    Get all transactions
// @route   GET /api/finance/transactions
// @access  Private/Admin
exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find().sort('-createdAt');
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// @desc    Create transaction
// @route   POST /api/finance/transactions
// @access  Private/Admin
exports.createTransaction = asyncHandler(async (req, res) => {
  const { type, amount, description, reference, relatedEmployee } = req.body;

  const transaction = await Transaction.create({
    type,
    amount,
    description,
    reference,
    relatedEmployee
  });

  res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc    Update transaction
// @route   PUT /api/finance/transactions/:id
// @access  Private/Admin
exports.updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Delete transaction
// @route   DELETE /api/finance/transactions/:id
// @access  Private/Admin
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Use findByIdAndDelete instead of remove
  await Transaction.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});


// @desc    Get financial summary
// @route   GET /api/finance/summary
// @access  Private/Admin
exports.getFinancialSummary = asyncHandler(async (req, res) => {
  const income = await Transaction.aggregate([
    { $match: { type: 'income', status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const expenses = await Transaction.aggregate([
    { $match: { type: { $in: ['expense', 'salary'] }, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalIncome: income.length ? income[0].total : 0,
      totalExpenses: expenses.length ? expenses[0].total : 0,
      balance: (income.length ? income[0].total : 0) - (expenses.length ? expenses[0].total : 0)
    }
  });
});