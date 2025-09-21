// utils/reportGenerator.js
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const Simulation = require("../models/Simulation");

async function generateReport() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([700, 800]); // wider page for extra columns
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  let y = height - 50;

  // === Title ===
  page.drawText("GreenCart Simulation Report", {
    x: 50,
    y,
    size: 20,
    font,
    color: rgb(0, 0.53, 0.71),
  });

  y -= 30;
  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  // === Fetch last 10 simulations ===
  const sims = await Simulation.find({}).sort({ createdAt: -1 }).limit(10);

  if (!sims.length) {
    y -= 40;
    page.drawText("No simulation data available.", { x: 50, y, size: 14, font });
    return await pdfDoc.save();
  }

  // === Summary (from latest run) ===
  const latest = sims[0].result;
  y -= 50;
  page.drawText("Summary (Latest Simulation)", {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 25;
  page.drawText(`Total Revenue: Rs. ${latest.total_revenue || 0}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 20;
  page.drawText(`Total Cost: Rs. ${latest.total_cost || 0}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 20;
  page.drawText(`Total Profit: Rs. ${latest.total_profit || 0}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 20;
  page.drawText(`Efficiency: ${latest.efficiency}%`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`On-time Deliveries: ${latest.on_time} / ${latest.total_deliveries}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  // === Table Header ===
  y -= 50;
  page.drawText("Last 10 Simulations", {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 30;
  const headers = ["Date", "Drivers", "Max Hours", "Revenue", "Cost", "Profit", "Efficiency", "On-time"];
  let x = 50;

  headers.forEach((h) => {
    page.drawText(h, { x, y, size: 10, font, color: rgb(0, 0, 0) });
    x += 80;
  });

  // === Table Rows ===
  sims.forEach((s) => {
    y -= 20;
    x = 50;
    const row = [
      new Date(s.createdAt).toLocaleDateString(),
      s.input_params?.num_drivers?.toString() || "-",
      s.input_params?.max_hours_per_driver?.toString() || "-",
      `Rs. ${s.result?.total_revenue || 0}`,
      `Rs. ${s.result?.total_cost || 0}`,
      `Rs. ${s.result?.total_profit || 0}`,
      `${s.result?.efficiency || 0}%`,
      `${s.result?.on_time || 0}/${s.result?.total_deliveries || 0}`,
    ];

    row.forEach((cell) => {
      page.drawText(cell, { x, y, size: 10, font });
      x += 80;
    });
  });

  return await pdfDoc.save();
}

module.exports = { generateReport };
