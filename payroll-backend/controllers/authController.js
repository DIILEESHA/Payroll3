// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register employee
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { employeeId, fullName, email, phoneNumber, salary, password, role } = req.body;

  try {
    // Check if employee exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return next(new ErrorResponse('Email already exists', 400));
    }

    // Create employee
    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phoneNumber,
      salary,
      password,
      role
    });

    // Create token
    const token = employee.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        id: employee._id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login employee
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for employee
    const employee = await Employee.findOne({ email }).select('+password');
    if (!employee) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token
    const token = employee.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        id: employee._id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout employee
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};