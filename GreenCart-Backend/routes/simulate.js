// routes/simulate.js
const express = require("express");
const Simulation = require("../models/Simulation");
const Driver = require("../models/Driver");
const Order = require("../models/Order");
const Route = require("../models/Route");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

// Utility to add minutes to HH:mm
function addMinutesToTime(timeStr, minutes) {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

// POST /api/simulate
router.post("/", requireAuth, async (req, res) => {
  try {
    const { num_drivers, max_hours_per_driver, route_start_time } = req.body;

    // fetch data
    const drivers = await Driver.find().limit(num_drivers);
    const orders = await Order.find();
    const routes = await Route.find();

    if (!drivers.length || !orders.length || !routes.length) {
      return res.status(400).json({ error: "Not enough data to simulate" });
    }

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let onTime = 0;
    let details = [];

    // assign orders round-robin to drivers
    orders.forEach((order, idx) => {
      const driver = drivers[idx % drivers.length];
      const route =
        routes.find((r) => r.route_id === order.route_id) || routes[0];

      const baseTime = parseInt(route.base_time_min, 10) || 30;
      const trafficMult =
        route.traffic_level === "High"
          ? 1.5
          : route.traffic_level === "Medium"
          ? 1.2
          : 1.0;

      const travelTime = baseTime * trafficMult;
      const endTime = addMinutesToTime(route_start_time, travelTime);

      // ✅ Use revenue & cost from DB
      const orderRevenue = order.revenue || 200;
      const orderCost = order.cost || (travelTime / 60) * 50;

      const profit = orderRevenue - orderCost;

      totalRevenue += orderRevenue;
      totalCost += orderCost;
      totalProfit += profit;

      const deliveredOnTime = travelTime <= max_hours_per_driver * 60;
      if (deliveredOnTime) onTime++;

      details.push({
        order: order._id,
        driver: driver.name,
        route: route.route_id,
        start: route_start_time,
        end: endTime,
        revenue: orderRevenue,
        cost: orderCost,
        profit,
        onTime: deliveredOnTime,
      });
    });

    const efficiency = Math.round((onTime / orders.length) * 100);

    const result = {
      total_revenue: Math.round(totalRevenue),
      total_cost: Math.round(totalCost),
      total_profit: Math.round(totalProfit),
      efficiency,
      on_time: onTime,
      total_deliveries: orders.length,
      details,
    };

    // Save in DB
    await Simulation.create({ input_params: req.body, result });

    return res.json(result);
  } catch (err) {
    console.error("simulate error", err);
    return res
      .status(500)
      .json({ error: "server error", details: err.message });
  }
});

// GET /api/simulate/history
router.get("/history", requireAuth, async (req, res) => {
  try {
    const sims = await Simulation.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(sims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
