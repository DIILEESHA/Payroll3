const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/logout
router.get('/logout', logout);

module.exports = router;