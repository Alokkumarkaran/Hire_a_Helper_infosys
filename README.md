<<<<<<< HEAD
# internship-infosys-2025-civix-team-01
=======
# HireHelper (MERN)

A minimal, runnable implementation of the HireHelper app with:
- Register/Login + Email OTP (prints to console in dev)
- JWT auth
- Tasks: add, feed, my tasks
- Requests: send, view received/sent, accept/reject
- Notifications API + Socket.IO hooks (basic)

## Prereqs
- Node 18+
- MongoDB Atlas (or local Mongo)

## Setup

### Backend
```
cd backend
cp .env.example .env  # edit values
npm install
npm run dev
```
If SMTP not configured, OTP is logged in the backend console.

### Frontend
```
cd frontend
npm install
# Create .env file if backend URL differs:
# echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev
```

Open http://localhost:5173

## Notes
- This is a clean MVP; enhance with image uploads, real push notifications, role validations, pagination, etc.
- For production, add robust error handling, rate limiting, logging, and input validation.
>>>>>>> b1134e8 (First commit — add project files (ignore node_modules & .env))
