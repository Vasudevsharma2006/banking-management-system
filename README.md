# Banking Management System

## Admin Login
```
Email: vs3427909@gmail.com
Password: vashu123456@
Name: Vashu
```

## Setup
1. Start MongoDB: `mongod` (default port 27017)
2. Backend: `cd backend && npm install && npm start`
3. Frontend: `cd frontend && npm install && npm run dev`

Server auto-seeds admin above. Restart backend to re-seed.

## API Endpoints
- POST /api/auth/login
- GET /api/admin/users (admin only)

## Fix Login Issue
1. Ensure MongoDB running.
2. Restart backend (`npm start` in backend/) - look for "New admin created" log.
3. Use exact admin creds above.

