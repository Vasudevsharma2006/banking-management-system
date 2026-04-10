# Banking Management System (MERN)

Modern and responsive full-stack banking website built with MongoDB, Express, React, and Node.js.

## Features
- User authentication (Register/Login) with JWT
- User dashboard with account balance, recent transactions, and charts
- Money transfer between users
- Transaction history page
- Admin dashboard to manage users and transactions
- Secure server-side and client-side form validation
- Blue/white modern UI theme with responsive layout
- Navbar + footer, icons, chart visualizations
- Optional dark mode (included)

## Project Structure
```text
banking management system/
  backend/
    package.json
    server.js
    .env.example
    src/
      config/db.js
      middleware/authMiddleware.js
      models/
        User.js
        Transaction.js
      routes/
        authRoutes.js
        userRoutes.js
        transactionRoutes.js
        adminRoutes.js
      utils/token.js
  frontend/
    package.json
    vite.config.js
    .env.example
    index.html
    src/
      main.jsx
      App.jsx
      api/api.js
      context/AuthContext.jsx
      components/
        Navbar.jsx
        Footer.jsx
        ProtectedRoute.jsx
        AdminRoute.jsx
      pages/
        HomePage.jsx
        AuthPage.jsx
        DashboardPage.jsx
        TransferPage.jsx
        HistoryPage.jsx
        AdminPage.jsx
      styles/global.css
```

## Backend Setup
1. Open terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and update values:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Run backend:
   ```bash
   npm run dev
   ```

## Frontend Setup
1. Open terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`
4. Run frontend:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Default Admin
- Email: value in `ADMIN_EMAIL` (default `admin@bank.com`)
- Password: value in `ADMIN_PASSWORD` (default `Admin@123`)

