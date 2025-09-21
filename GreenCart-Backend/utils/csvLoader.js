// backend/utils/csvLoader.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const connectDB = require('../config/db');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/greencart';
const BASE = process.env.CSV_BASE_PATH || '/data';

async function load() {
  await connectDB(URI);

  const driversPath = path.join(BASE, 'drivers.csv');
  const ordersPath = path.join(BASE, 'orders.csv');
  const routesPath = path.join(BASE, 'routes.csv');

  async function readCSV(p) {
    const content = fs.readFileSync(p, 'utf8');
    return parse(content, { columns: true, skip_empty_lines: true });
  }

  try {
    const drows = await readCSV(driversPath);
    const orows = await readCSV(ordersPath);
    const rrows = await readCSV(routesPath);

    // Clear collections
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    // Drivers
    for (const r of drows) {
      const name = r.name || r.Name || 'Unknown';
      const shift = parseFloat(r.shift_hours || r.shift || r.current_shift_hours || 0) || 0;
      const pastWeek = (r.past_week_hours || r.past_week || '')
        .split('|')
        .map(s => parseFloat(s))
        .filter(n => !Number.isNaN(n));
      await Driver.create({ name, current_shift_hours: shift, past_7_days: pastWeek });
    }

    // Routes
    for (const r of rrows) {
      const route_id = r.route_id || r.RouteID || r.route || '';
      const distance_km = parseFloat(r.distance_km || r.distance || 0) || 0;
      const traffic_level = r.traffic_level || r.traffic || 'Low';
      const base_time_min = parseFloat(r.base_time_min || r.base_time || 0) || 0;
      await Route.create({
        route_id: route_id.toString(), // always store as string
        distance_km,
        traffic_level,
        base_time_min
      });
    }

    // Orders
    for (const o of orows) {
      const order_id = o.order_id || o.OrderID || o.order || '';
      const value_rs = parseFloat(o.value_rs || o.value || 0) || 0;
      const assigned_route = (o.assigned_route || o.route_id || o.route || '').toString(); // always string
      let delivery_timestamp = null;

      // Handle delivery_time or delivery_timestamp
      if (o.delivery_timestamp || o.delivery_time) {
        const d = new Date(o.delivery_timestamp || o.delivery_time);
        if (!isNaN(d)) delivery_timestamp = d;
      }

      await Order.create({
        order_id: order_id.toString(),
        value_rs,
        assigned_route,
        delivery_timestamp
      });
    }

    console.log('CSV data loaded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error loading CSVs:', err);
    process.exit(1);
  }
}

load();
