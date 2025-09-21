// routes/load_csv.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /api/load_csv/:type
router.post("/:type", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const { type } = req.params;
    const filePath = req.file.path;

    let Model;
    if (type === "drivers") Model = Driver;
    else if (type === "routes") Model = Route;
    else if (type === "orders") Model = Order;
    else return res.status(400).json({ error: "Invalid type" });

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (type === "orders") {
          results.push({
            order_id: row.order_id,
            route_id: row.route_id || "",
            revenue: Number(row.revenue) || 0,
            cost: Number(row.cost) || 0,
            status: row.status || "pending",
          });
        } else if (type === "drivers") {
          results.push({
            name: row.name,
            current_shift_hours: Number(row.current_shift_hours) || 0,
            past_7_days: row.past_7_days ? row.past_7_days.split(",") : [],
          });
        } else if (type === "routes") {
          results.push({
            route_id: row.route_id,
            distance_km: Number(row.distance_km) || 0,
            traffic_level: row.traffic_level || "Low",
            base_time_min: Number(row.base_time_min) || 0,
          });
        }
      })
      .on("end", async () => {
        try {
          await Model.insertMany(results, { ordered: false });
          fs.unlinkSync(filePath); // cleanup
          res.json({
            message: `${type} uploaded successfully`,
            count: results.length,
          });
        } catch (err) {
          if (err.code === 11000) {
            res.json({
              message: `${type} uploaded with some duplicates skipped`,
              count: results.length,
              duplicates: true,
            });
          } else {
            console.error("Insert error", err);
            res.status(500).json({ error: "Insert failed", details: err.message });
          }
        }
      });
  } catch (err) {
    console.error("CSV upload error", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
