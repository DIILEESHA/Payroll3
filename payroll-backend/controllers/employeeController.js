const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
exports.getEmployees = asyncHandler(async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin
exports.getEmployee = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID format'
      });
    }

    const employee = await Employee.findById(req.params.id).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = asyncHandler(async (req, res) => {
  try {
    const { employeeId, fullName, email, phoneNumber, salary, password, role } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phoneNumber,
      salary,
      password,
      role
    });

    // Remove password from response
    employee.password = undefined;

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID format'
      });
    }

    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Check if email is being updated and exists
    if (req.body.email) {
      const existingEmployee = await Employee.findOne({ email: req.body.email });
      if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid employee ID format'
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});