## OEMAlert

OEMAlert is a full‑stack application for monitoring medical device vulnerabilities and compliance. It consists of a React (Vite + TypeScript + Tailwind) frontend and a Node.js (Express + Mongoose) backend connected to MongoDB.

### Features
- Dashboard with vulnerability trends and alert summaries
- Device inventory and compliance status
- Authentication with JWT (login, profile)
- Email notifications (configurable SMTP)
- Rate limiting, CORS, and Helmet hardening

### Tech Stack
- Frontend: React 18, Vite 5, TypeScript, TailwindCSS, lucide-react
- Backend: Node.js 18+, Express, Mongoose, JWT, Winston
- Database: MongoDB (Atlas or local)

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas account or local MongoDB Community Server)
- (Optional) Gmail/App password or another SMTP provider for email alerts

### Repository Structure
```text
.
├─ backend/
│  ├─ package.json
│  ├─ server.env                # Backend environment variables (example below)
│  └─ src/
│     ├─ server.js              # Express server and MongoDB connection
│     ├─ controllers/
│     ├─ middleware/
│     ├─ models/                # Mongoose schemas: User, Device, Alert, Vulnerability
│     ├─ routes/                # auth, vulnerabilities, devices, alerts, compliance, users
│     ├─ services/
│     └─ utils/
├─ src/                         # Frontend source (Vite React + TS)
├─ package.json                 # Frontend package.json
└─ README.md
```

---

## Setup

### 1) Install dependencies
```powershell
cd D:\OEMAlert-main
npm install

cd D:\OEMAlert-main\backend
npm install
```

### 2) Configure environment variables (Backend)

Create or edit `backend/server.env` and set real values:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=OEMAlert

# JWT
JWT_SECRET=replace-with-strong-random-secret
JWT_EXPIRE=7d

# Email (example for Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password-or-smtp-password
EMAIL_FROM=OEMAlert System <noreply@oemalert.com>

# Alerts / thresholds
ALERT_EMAIL_RECIPIENTS=admin@hospital.com,security@hospital.com
CRITICAL_ALERT_THRESHOLD=9.0
HIGH_ALERT_THRESHOLD=7.0

# External CVE/NVD
NVD_API_KEY=your-nvd-api-key
CVE_API_BASE_URL=https://services.nvd.nist.gov/rest/json/cves/2.0

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/oemalert.log
```

Notes:
- Do not commit real secrets. Prefer using a non-committed `.env` file and keep a `.env.example` for reference.
- Ensure `backend/logs/` exists or adjust `LOG_FILE` path.

### 3) Configure Supabase (Frontend)

Create `.env` in project root:
```env
VITE_SUPABASE_URL=https://supabase.com/dashboard/project/lusttjnyvpsvtwuzjvyh
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Install SDK:
```powershell
cd D:\OEMAlert-main
npm i @supabase/supabase-js
```

### 4) Configure Vite dev proxy (Frontend)

To avoid CORS in development, proxy `/api` to the backend in `vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

---

## Running Locally

### Start the backend
```powershell
cd D:\OEMAlert-main\backend
npm run dev
# Server: http://localhost:5000
# Health: http://localhost:5000/health
```

### Start the frontend
```powershell
cd D:\OEMAlert-main
npm run dev
# Vite dev server: http://localhost:5173
```

### Optional: One command to run both (concurrently)
Add to root `package.json`:
```json
{
  "devDependencies": { "concurrently": "^9.0.0" },
  "scripts": {
    "dev:all": "concurrently \"npm run dev\" \"npm --prefix backend run dev\""
  }
}
```
Run:
```powershell
cd D:\OEMAlert-main
npm install
npm run dev:all
```

---

## Backend Notes

### MongoDB
The backend uses Mongoose. Set `MONGODB_URI` and `DB_NAME` in `backend/server.env`. Atlas or local MongoDB are both supported.

### Routes (overview)
- `GET /health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`, `POST /api/auth/logout`
- `GET /api/vulnerabilities`, `GET /api/vulnerabilities/trends`, `GET /api/vulnerabilities/:id`, `POST /api/vulnerabilities`, `PUT /api/vulnerabilities/:id`, `DELETE /api/vulnerabilities/:id`, `PATCH /api/vulnerabilities/bulk-update`
- `GET/POST/PUT/DELETE /api/devices` (as implemented)
- `GET/POST/PUT/DELETE /api/alerts` (as implemented)
- `GET /api/compliance` (as implemented)
- `GET/PUT /api/users` (as implemented)

Ensure these routes are mounted in `backend/src/server.js`:
```js
const authRoutes = require('./routes/auth');
const vulnerabilityRoutes = require('./routes/vulnerabilities');
const deviceRoutes = require('./routes/devices');
const alertRoutes = require('./routes/alerts');
const complianceRoutes = require('./routes/compliance');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/users', userRoutes);
```

### Security
- CORS is configured for `http://localhost:5173` in development; update for production domains
- Helmet is enabled by default
- Rate limiting configured via env values

---

## Frontend Notes

- Vite + React + TypeScript project in `src/`
- Add API client (e.g., `src/lib/api.ts`) that attaches `Authorization: Bearer <token>` to protected requests
- Integrate UI components to call backend endpoints (vulnerabilities, devices, alerts, auth)

---

## Scripts

Frontend (root):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

Backend (`backend/package.json`):
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

---

## Testing & Linting
```powershell
# Frontend lint
cd D:\OEMAlert-main
npm run lint

# Backend lint
cd D:\OEMAlert-main\backend
npm run lint
```
Basic backend tests can be added with Jest + Supertest (e.g., health endpoint and auth flow).

---

## Deployment

1. Set `NODE_ENV=production` and production secrets
2. Build frontend (`npm run build`) and host static assets (or serve via a CDN)
3. Deploy backend to your host (Docker/PM2/etc.) and configure environment variables
4. Configure CORS to your production frontend domain
5. Ensure MongoDB Atlas network access (IP allowlist) and backups

---

## Troubleshooting

- Backend cannot connect to MongoDB
  - Check `MONGODB_URI`, `DB_NAME`, and Atlas IP allowlist
  - Verify credentials and SRV string
- 404 on API calls from frontend
  - Ensure Vite proxy is set and backend routes are mounted
  - Confirm backend is running on `http://localhost:5000`
- CORS errors
  - Confirm Vite proxy or update backend CORS origins for dev/prod
- Email not sending
  - Use app password for Gmail or switch to a transactional provider
- Logs missing
  - Ensure `backend/logs/` exists or adjust `LOG_FILE`

---

## License
MIT


