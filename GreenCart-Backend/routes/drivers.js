const express = require('express');
const Driver = require('../models/Driver');
const requireAuth = require('../middleware/authMiddleware');
const router = express.Router();

// GET all drivers
router.get('/', requireAuth, async (req, res) => {
  const ds = await Driver.find({});
  res.json(ds);
});

// POST create
router.post('/', requireAuth, async (req, res) => {
  const d = await Driver.create(req.body);
  res.json(d);
});

// GET/PUT/DELETE by id
router.get('/:id', requireAuth, async (req, res) => {
  const d = await Driver.findById(req.params.id);
  if (!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
});
router.put('/:id', requireAuth, async (req, res) => {
  const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(d);
});
router.delete('/:id', requireAuth, async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ status: 'deleted' });
});

module.exports = router;
