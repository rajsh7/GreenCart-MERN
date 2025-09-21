// routes/routes.js
const express = require("express");
const router = express.Router();

// Example: replace with your actual DB model if needed
// const Route = require("../models/Route");

// GET all routes
router.get("/", async (req, res) => {
  try {
    // const routes = await Route.find();
    const routes = [
      { id: 1, start: "Warehouse", end: "City Center" },
      { id: 2, start: "Depot", end: "North Zone" },
    ];
    res.json(routes);
  } catch (err) {
    console.error("Error fetching routes:", err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// POST create a new route
router.post("/", async (req, res) => {
  try {
    const { start, end } = req.body;
    // const newRoute = await Route.create({ start, end });
    const newRoute = { id: Date.now(), start, end };
    res.status(201).json(newRoute);
  } catch (err) {
    console.error("Error creating route:", err);
    res.status(500).json({ error: "Failed to create route" });
  }
});

module.exports = router;
