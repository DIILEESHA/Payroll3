// models/Payroll.js
const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { 
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);