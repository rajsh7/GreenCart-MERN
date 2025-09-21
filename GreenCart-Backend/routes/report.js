// routes/report.js
const express = require("express");
const { generateReport } = require("../utils/reportGenerator");
const requireAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const pdfBytes = await generateReport();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    // send as buffer, not text
    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;
