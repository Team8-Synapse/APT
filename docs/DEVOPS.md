# Developer Documentation: Amrita Placement Tracker

This document provides a comprehensive overview of the Amrita Placement Tracker system, designed to streamline placement activities for students and administrators.

---

## 1. Project Overview
The **Amrita Placement Tracker** is a MERN-stack application (MongoDB, Express, React, Node.js) that manages placement drives, student profiles, and eligibility tracking. 

### Core Features:
- **Authentication**: Role-based access for Students and Admins.
- **Student Dashboard**: Portfolio management, eligibility checks, and resource access.
- **Admin Dashboard**: Drive management, student tracking, and report generation.
- **AI Integration**: AI-powered career assistance and chatbot.
- **Reporting**: Automated PDF/CSV reports for students and department-wise summaries for admins.

---

## 2. Setup Guide

### Option A: Using Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
3. The client will be available at `http://localhost:80` and the server at `http://localhost:5000`.

### Option B: Manual Setup
#### Server
1. Navigate to `server/`.
2. Install dependencies: `npm install`.
3. Create a `.env` file with `MONGODB_URI` and `JWT_SECRET`.
4. Start the server: `npm start` (Runs on port 5005 by default).

#### Client
1. Navigate to `client/`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev` (Runs on Vite's default port).

---

## 3. Architecture / Design

### System Flow
The application follows a standard Client-Server architecture:
1. **Frontend (React/Vite)**: Communicates with the backend via Axios.
2. **Backend (Express)**: Handles business logic, authentication (JWT), and PDF/CSV generation.
3. **Database (MongoDB)**: Stores user data and placement records using Mongoose ODM.

### Directory Structure
- `client/src/pages`: Main view components (Dashboards, Login, Profile).
- `client/src/components`: Shared UI components (Navbar, Chatbot).
- `server/controllers`: Logic for handling API requests.
- `server/models`: Mongoose schemas (User, StudentProfile, etc.).
- `server/routes`: API endpoint definitions.

---

## 4. API Documentation

### Auth Endpoints (`/api/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate and receive a JWT.
- `POST /logout`: Invalidates session on client-side.

### Student Endpoints (`/api/student`)
- `GET /profile`: Fetch current student profile.
- `POST /profile`: Create or update profile data.
- `GET /eligibility`: Check placement eligibility based on CGPA and backlogs.

### Report Endpoints (`/api/reports`)
- `GET /student-pdf`: Download performance report in PDF.
- `GET /admin-csv`: Download department summary in CSV (Admin only).

---

## 5. Database Schema

### User Model
```javascript
{
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'admin'] },
  failedAttempts: { type: Number },
  isLocked: { type: Boolean }
}
```

### Student Profile Model
```javascript
{
  userId: { type: ObjectId, ref: 'User' },
  firstName: String,
  lastName: String,
  department: String,
  cgpa: Number,
  batch: String,
  backlogs: Number,
  isEligible: Boolean
}
```

---

## 6. Coding Standards
- **Naming**: Use CamelCase for components and files (`StudentDashboard.jsx`), camelCase for variables/functions.
- **Formatting**: Adhere to ESLint rules defined in `client/eslint.config.js`.
- **Modularity**: Keep controllers separate from route definitions for testability.
- **Security**: Always hash passwords (Bcrypt) and use JWT for session management.

---

## 7. Deployment Steps
1. **Prepare Environment**: Update `.env` with production database URIs.
2. **Build Client**: Run `npm run build` in `client/` to generate the `dist` folder.
3. **Containerize**: Use the provided `Dockerfile` in `client/` and `server/` to build images.
4. **Push**: Deploy images to a registry (e.g., Docker Hub) or directly to a VPS/Cloud provider using Docker Compose.

---

## 8. Troubleshooting

### Common Errors
- **MongoDB Connection Failed**: Ensure the MongoDB service is running or the `MONGODB_URI` in `.env` is correct.
- **JWT Secret Missing**: Ensure `JWT_SECRET` is set; the app will default to a fallback which is insecure for production.
- **Account Locked**: If an admin fails login 5 times, the account locks. Manually reset `isLocked: false` in the database.
- **Port Conflict**: Server defaults to 5005. Check if another process is using it if startup fails.
