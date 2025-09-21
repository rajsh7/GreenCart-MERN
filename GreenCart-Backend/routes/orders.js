const express = require("express");
const Order = require("../models/Order");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/orders
 * Optional query: ?status=pending or ?route=R1
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status, route } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (route) filter.route_id = route; // ✅ match schema

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order by id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new order
router.post("/", requireAuth, async (req, res) => {
  try {
    const { order_id, route_id, revenue, cost, status } = req.body;
    if (!order_id || revenue == null || cost == null) {
      return res.status(400).json({ error: "order_id, revenue and cost are required" });
    }

    const newOrder = await Order.create({
      order_id,
      route_id,
      revenue,
      cost,
      status: status || "pending",
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE order
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { order_id, route_id, revenue, cost, status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { order_id, route_id, revenue, cost, status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE order
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
