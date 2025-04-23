// backend/routes/payroll.js
const express = require('express');
const router = express.Router();
const {
  getPayrolls,
  getEmployeePayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll
} = require('../controllers/payrollController');

router.route('/')
  .get(getPayrolls)
  .post(createPayroll);

router.route('/employee/:employeeId')
  .get(getEmployeePayrolls);

router.route('/:id')
  .put(updatePayroll)
  .delete(deletePayroll);

module.exports = router;