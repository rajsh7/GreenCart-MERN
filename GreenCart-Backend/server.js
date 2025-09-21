require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const driversRoutes = require("./routes/drivers");
const routesRoutes = require("./routes/routes");
const ordersRoutes = require("./routes/orders");
const simulateRoutes = require("./routes/simulate");
const uploadRoutes = require("./routes/upload");
const loadCSVRoutes = require("./routes/load_csv");
const reportRoutes = require("./routes/report");

const app = express();

// ✅ Explicit CORS configuration
const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://green-cart-mern-uyzg.vercel.app"    // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy does not allow access from origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api", authRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/routes", routesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/simulate", simulateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/load_csv", loadCSVRoutes);
app.use("/api/report", reportRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/greencart";

connectDB(MONGO).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});
