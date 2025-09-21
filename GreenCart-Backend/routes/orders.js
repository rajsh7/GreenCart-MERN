// routes/orders.js
const express = require("express");
const router = express.Router();

// Example: replace with your actual DB model if needed
// const Order = require("../models/Order");

// GET all orders
router.get("/", async (req, res) => {
  try {
    // const orders = await Order.find();
    const orders = [
      { id: 1, customer: "John Doe", status: "Delivered" },
      { id: 2, customer: "Jane Smith", status: "Pending" },
    ];
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST create a new order
router.post("/", async (req, res) => {
  try {
    const { customer, status } = req.body;
    // const newOrder = await Order.create({ customer, status });
    const newOrder = { id: Date.now(), customer, status };
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
