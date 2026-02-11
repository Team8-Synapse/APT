# Quick Start Guide

**Get the Amrita Placement Tracker running in 2 minutes!**

## 1. Install Dependencies
Run this in the root folder (if a script exists) or manually:
```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

## 2. Configure Environment
Ensure `.env` files are present in both `server/` and `client/` directories.
- **Server**: Needs DB connection string.
- **Client**: Needs API URL.

## 3. Start the App
**Terminal 1 (Backend):**
```bash
cd server
npm start
```
*Server runs on http://localhost:5005*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Client runs on http://localhost:5173*

## 4. Login
- **Admin**: `cir@amrita.edu` / `password123`
- **Student**: `cb.sc.u4cse23621@cb.students.amrita.edu` / `Harini05`
