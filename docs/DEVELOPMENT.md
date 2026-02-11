# Development Setup Guide

## Prerequisites
- **Node.js**: v14.0.0 or higher.
- **npm**: v6.0.0 or higher.
- **MongoDB**: Local instance or MongoDB Atlas URL.

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd APT
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create .env file with MONGODB_URI, JWT_SECRET, PORT
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create .env file with VITE_API_URL
   npm run dev
   ```

## Environment Variables
### Server (`.env`)
```
PORT=5005
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

### Client (`.env`)
```
VITE_API_URL=http://localhost:5005/api
```

## Running Tests
- Currently, manual testing is performed.
- Future: Run `npm test` in the respective directory.
