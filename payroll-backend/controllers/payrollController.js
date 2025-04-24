// backend/controllers/payrollController.js
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private/Admin
exports.getPayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find().populate('employee', 'employeeId fullName email');
  res.status(200).json({
    success: true,
    count: payrolls.length,
    data: payrolls
  });
});

exports.getPayroll = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching payroll with ID:', req.params.id);
    
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payroll ID format' 
      });
    }

    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'employeeId fullName email salary', // Include salary here
        model: 'Employee'
      });
    
    if (!payroll) {
      return res.status(404).json({ 
        success: false, 
        error: 'Payroll record not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: payroll 
    });
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching payroll' 
    });
  }
});

// @desc    Get payrolls for specific employee
// @route   GET /api/payroll/employee/:employeeId
// @access  Private
exports.getEmployeePayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find({ employee: req.params.employeeId });
  res.status(200).json({
    success: true,
    count: payrolls.length,
    data: payrolls
  });
});

// @desc    Create payroll record
// @route   POST /api/payroll
// @access  Private/Admin
exports.createPayroll = asyncHandler(async (req, res) => {
  const { employee, month, year, basicSalary, allowances, deductions, tax } = req.body;

  // Check if employee exists
  const emp = await Employee.findById(employee);
  if (!emp) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Check if payroll already exists for this period
  const existingPayroll = await Payroll.findOne({ employee, month, year });
  if (existingPayroll) {
    res.status(400);
    throw new Error('Payroll already exists for this period');
  }

  const netSalary = basicSalary + allowances - deductions - tax;

  const payroll = await Payroll.create({
    employee,
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    tax,
    netSalary
  });

  res.status(201).json({
    success: true,
    data: payroll
  });
});

// @desc    Update payroll record
// @route   PUT /api/payroll/:id
// @access  Private/Admin
exports.updatePayroll = asyncHandler(async (req, res) => {
  try {
    let payroll = await Payroll.findById(req.params.id).populate('employee');
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    // Verify employee exists if being changed
    if (req.body.employee) {
      const employee = await Employee.findById(req.body.employee);
      if (!employee) {
        return res.status(400).json({
          success: false,
          error: 'Employee not found'
        });
      }
    }

    // Recalculate net salary if financial fields change
    const basicSalary = req.body.basicSalary ?? payroll.basicSalary;
    const allowances = req.body.allowances ?? payroll.allowances;
    const deductions = req.body.deductions ?? payroll.deductions;
    const tax = req.body.tax ?? payroll.tax;
    
    req.body.netSalary = basicSalary + allowances - deductions - tax;

    payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('employee');

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during update'
    });
  }
});

exports.deletePayroll = asyncHandler(async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    await Payroll.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});