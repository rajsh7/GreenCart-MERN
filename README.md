Perfect 🎉 since your project is nearly done, let’s create a **professional README.md** for your **GreenCart Logistics Optimization Project**.

Here’s a complete version 👇

---

# 🚚 GreenCart Logistics Optimization

GreenCart is a logistics simulation and management platform that helps optimize delivery operations.
It provides **driver management, route management, order management, simulation engine, analytics, and PDF report generation**.

---

## 📌 Features

* **Authentication**

  * Secure login with JWT.
  * Dashboard accessible only after login.

* **Drivers Management**

  * Add, update, delete drivers.
  * Upload drivers via CSV.
  * Track current shift hours and past 7-day working hours.

* **Routes Management**

  * Manage delivery routes.
  * Upload routes via CSV.
  * Track distance, base time, and traffic levels.

* **Orders Management**

  * Add, update, delete orders.
  * Upload orders via CSV.
  * Track order status (`pending`, `delivered`, `cancelled`).

* **Simulation Engine**

  * Allocate drivers to routes and orders.
  * Calculate total profit, delivery efficiency, and on-time deliveries.
  * Store simulation history in MongoDB.

* **Analytics Dashboard**

  * 📊 Profit trend.
  * ⚡ Efficiency charts.
  * 📦 Deliveries performance.
  * Cost vs Profit chart.
  * Simulation history log.

* **Report Generation**

  * Generate **PDF reports** with KPIs and last 10 simulation results.
  * Download reports directly from dashboard.

---

## 🛠 Tech Stack

### Backend

* **Node.js + Express.js**
* **MongoDB + Mongoose**
* JWT Authentication
* `pdf-lib` for report generation
* `multer` + `csv-parser` for CSV uploads

### Frontend

* **React.js (Vite)**
* React Router v6
* Fetch + Axios for API calls
* Custom components for charts (`recharts`)

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/greencart.git
cd greencart
```

### 2. Backend Setup

```bash
cd GreenCart-Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your_secret_key
```

Start backend:

```bash
nodemon server.js
```

### 3. Frontend Setup

```bash
cd GreenCart-Frontend
npm install
npm run dev
```

---

## 📂 CSV Upload Format

### `drivers.csv`

```csv
name,current_shift_hours,past_7_days
John Doe,6,"8,7,6,8,5,7,6"
Jane Smith,4,"6,6,5,7,8,6,5"
```

### `routes.csv`

```csv
route_id,distance_km,traffic_level,base_time_min
R1,15,High,40
R2,10,Medium,30
```

### `orders.csv`

```csv
order_id,route_id,revenue,cost,status
O1,R1,1200,400,pending
O2,R2,1500,500,delivered
```

---

## 🚀 Deployment

* **Backend:** Deploy on **Render / Railway / Heroku**
* **Frontend:** Deploy on **Vercel / Netlify**
* Update API base URL in `src/api.js` when deploying.

---

## 📊 Screenshots

* **Login Page**
* **Dashboard with KPIs**
* **Simulation Charts**
* **Orders Management**
* **Drivers Management**
* **CSV Upload**
* **Generated PDF Report**

---

## 👨‍💻 Author

Developed by **\[Raj Sharma]** 🚀
For logistics optimization and simulation management.

---

⚡ With this README, your project looks **professional & deployment-ready**.

👉 Do you also want me to include **deployment instructions for Render (backend) + Vercel (frontend)** in this README?
