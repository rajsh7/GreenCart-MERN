const express = require('express');
const Order = require('../models/Order');
const requireAuth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const items = await Order.find({});
  res.json(items);
});
router.post('/', requireAuth, async (req, res) => {
  const o = await Order.create(req.body);
  res.json(o);
});
router.get('/:id', requireAuth, async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) return res.status(404).json({ error: 'not found' });
  res.json(o);
});
router.put('/:id', requireAuth, async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(o);
});
router.delete('/:id', requireAuth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ status: 'deleted' });
});

module.exports = router;
