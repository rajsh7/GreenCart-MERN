// backend/models/Route.js
const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  route_id: { type: String, required: true, unique: true },
  distance_km: { type: Number, required: true },
  traffic_level: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  base_time_min: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);
