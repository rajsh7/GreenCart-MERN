# GreenCart - MERN Assessment

## Requirements
- Node 18+
- npm
- MongoDB (local) OR use docker-compose (includes Mongo)

## Quick run (local, without docker)
1. Start MongoDB (e.g., `mongod --dbpath /path/to/db`)
2. Backend:
   - cd backend
   - cp .env.example .env (edit if needed)
   - npm install
   - npm run dev   (or `npm start`)
3. Load CSVs:
   - Put `drivers.csv`, `orders.csv`, `routes.csv` in a folder (e.g., `/mnt/data`)
   - Set `CSV_BASE_PATH` in `.env` to that folder
   - from `backend` run: `node utils/csvLoader.js`
4. Frontend:
   - cd frontend
   - npm install
   - npm run start
   - Open `http://localhost:3000` (or Vite's assigned port)

## Quick run (docker-compose)
- Put your CSV files in `./data` (repo-root `data/`).
- `docker-compose up --build`
- Wait for services to be ready.
- Load CSVs: `docker-compose exec backend node utils/csvLoader.js`
- Frontend available at `http://localhost:3000` (depends on command).

## API endpoints (examples)
- POST `/api/login`  -> { username, password } returns { token }
- POST `/api/simulate` (protected) -> { num_drivers, route_start_time, max_hours_per_driver }
- GET `/api/simulate/history` (protected)
- CRUD: `/api/drivers`, `/api/routes`, `/api/orders` (protected)

Default admin credentials in `.env.example`: manager / managerpass
JWT secret in `.env.example` is `change_this_secret` — change in production.

