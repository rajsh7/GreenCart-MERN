// routes/upload.js
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const requireAuth = require("../middleware/authMiddleware");

const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /api/upload/:type (type = drivers, routes, orders)
router.post("/:type", requireAuth, upload.single("file"), async (req, res) => {
  const { type } = req.params;
  const filePath = path.join(__dirname, "..", req.file.path);

  let Model;
  if (type === "drivers") Model = Driver;
  else if (type === "routes") Model = Route;
  else if (type === "orders") Model = Order;
  else return res.status(400).json({ error: "Invalid type" });

  try {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        await Model.insertMany(results);
        fs.unlinkSync(filePath);
        res.json({ message: `${results.length} ${type} uploaded successfully` });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
