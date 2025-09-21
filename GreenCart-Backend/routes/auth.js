const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const ADMIN_USER = process.env.ADMIN_USER || 'manager';
const ADMIN_PASS = process.env.ADMIN_PASS || 'managerpass';
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'invalid credentials' });
});

module.exports = router;
