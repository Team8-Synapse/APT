# Amrita Placement Tracker

<div align="center">

<<<<<<< HEAD
![Version](https://img.shields.io/badge/version-1.1.0-darkred?style=for-the-badge)
![Build](https://img.shields.io/badge/build-passing-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-darkgreen?style=for-the-badge)
![React](https://img.shields.io/badge/react-19.2.0-61dafb?style=for-the-badge)

### **Next-Generation Campus Placement Management System**

*Streamlining placement tracking with AI-enhanced insights, real-time analytics, and collaborative peer stories*

[Features](#features) • [Tech Stack](#tech-stack) • [System Flow](#system-flow) • [Installation](#installation) • [API Guide](#api-documentation) • [Team](#team)

---

<img src="https://raw.githubusercontent.com/andreasbm/rainbow-line/master/line.png" width="100%">
=======
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)

![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)



### **Next-Generation Campus Placement Management System**

*Structures placement tracking of Amrita Vishwa Vidyapeetham with AI-powered insights and analytics*

---

>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

</div>

## Overview

<<<<<<< HEAD
**Amrita Placement Tracker (APT)** is an enterprise-grade, full-stack ecosystem designed to optimize campus recruitment at Amrita Vishwa Vidyapeetham. It provides a bridge between the Career & Internship Readiness (CIR) team, students, and alumni, delivering centralized tracking, deep behavioral analytics, and AI-driven growth metrics.
=======
**Amrita Placement Tracker** is a full-stack placement management ecosystem built to redefine how campus recruitment is monitored and optimized at Amrita Vishwa Vidyapeetham. Engineered for the Corporate and Industry Relations team (CIR) team and students of the university, the platform provides centralized tracking, intelligent automation, advanced analytics dashboards, and AI-driven insights — empowering data-backed strategies that significantly improve placement performance.
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

### 🌟 Why APT?
- **AI-Enhanced Readiness**: Proprietary scoring algorithm mapping CGPA and skills to industry requirements.
- **Storytelling Hub**: Students share and learn from real-world interview experiences.
- **Enterprise-Scale Dashboards**: High-fidelity metrics for institutional oversight.
- **Real-Time Synergy**: Live tickers, instant notifications, and dynamic scheduling.

---

## 🏗️ System Architecture & Flow

<details open>
<summary><b>View System Interaction</b></summary>

```mermaid
<<<<<<< HEAD
sequenceDiagram
    participant S as Student
    participant A as Admin
    participant API as Express API
    participant DB as MongoDB / Supabase
    participant AI as AI Engine

    S->>API: Login & Activity
    API->>DB: Fetch Profile & History
    API->>AI: Compute Readiness & Matches
    AI-->>API: Insights & Recommendation
    API-->>S: Personalized Dashboard

    A->>API: Upload CSV / Managed Drives
    API->>DB: Bulk Write / Update Status
    API-->>S: Live Ticker Notifications
=======
graph TB
    A[Student Portal] -->|REST API| E[Express Backend]
    B[Admin Portal] -->|REST API| E
    C[Analytics Dashboard] -->|REST API| E
    E -->|Data Layer| F[MongoDB]
    E -->|AI Processing| G[OpenRouter API]
    G -->|Insights| E
    E -->|Response| A
    E -->|Response| B
    E -->|Response| C
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3
    
    rect rgb(139, 0, 0, 0.1)
        Note over S,A: Shared Resource Hub & Interview Stories
    end
```

</details>

---

## 🚀 Key Capabilities

<table>
<tr>
<td width="50%">

### 🎓 Student Ecosystem
- **Dynamic Dashboard**: Personalized placement funnel and metric visualization.
- **Interview Stories**: Access and contribute to a database of real interview experiences.
- **AI Growth Path**: Skill gap analysis and tailored preparation recommendations.
- **Prep Hub**: Curated materials for technical and aptitude rounds.
- **Calendar Sync**: Integrated schedule for drives and mock rounds.
- **Alumni Connect**: Insights from successfully placed seniors.

</td>
<td width="50%">

### 🛡️ Administrative Portal
- **Operational Oversight**: Total visibility into student readiness and offer conversion.
- **Drive Engine**: Create and manage multi-stage recruitment drives seamlessly.
- **Advanced Reports**: Export deep-dive analytics in PDF, CSV, and Excel formats.
- **Ticker Manager**: Broadcast urgent updates to the student community instantly.
- **Student Directory**: Robust management with bulk upload and data validation.
- **Interactive Ticker**: Manage live scrolling status updates.

</td>
</tr>
</table>

---

## 🛠️ Technology Stack

<div align="center">

<<<<<<< HEAD
| Core | Technologies |
|------|--------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css) ![Framer](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer) |
| **Backend** | ![Node](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js) ![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square) ![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens) |
| **Data** | ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb) ![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=flat-square&logo=supabase) |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-Unit-729B1B?style=flat-square&logo=vitest) ![Jest](https://img.shields.io/badge/Jest-Backend-C21325?style=flat-square&logo=jest) |
=======
### Frontend Architecture

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.4-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-Latest-F56565?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Vitest-Latest-729B1B?style=for-the-badge&logo=vitest&logoColor=white)

### Backend Infrastructure

![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-FF6B6B?style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-Latest-C21325?style=for-the-badge&logo=jest&logoColor=white)

### Data & Storage

![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white)
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

</div>

---

<<<<<<< HEAD
## 📂 Project Structure
=======
## System Architecture

<details>
<summary><b>Component Breakdown</b></summary>

```
├── Frontend Layer    
│   ├── Student Portal
│   │   ├── Dashboard (Real-time stats, notifications)
│   │   ├── Drives (Browse, filter, apply)
│   │   ├── Applications (Track status, rounds)
│   │   ├── Profile (CGPA, skills, resume)
│   │   ├── Resources (Prep materials, guides)
│   │   └── Analytics (Personal insights)
│   │
│   ├── Admin Portal
│   │   ├── Dashboard (System overview, metrics)
│   │   ├── Students (Bulk upload, management)
│   │   ├── Drives (Create, edit, close)
│   │   ├── Applications (Review, update status)
│   │   ├── Analytics (Department, company stats)
│   │   └── Reports (Generate, export)
│   │
│   └── Shared Components
│       ├── Navigation
│       ├── Forms & Inputs
│       ├── Charts & Graphs
│       ├── Tables & Lists
│       └── Modals & Dialogs
│
├── Backend Layer
│   ├── Authentication Service
│   ├── Student Management
│   ├── Drive Management
│   ├── Application Processing
│   ├── Analytics Engine
│   ├── AI Integration
│   └── Report Generator
│
└── Data Layer
    ├── MongoDB (Mongoose Schema)
    ├── Validation schemas
    └── Backup mechanisms
```

</details>

---

## AI-Powered Features

The platform leverages **OpenRouter API** for intelligent insights:

<table>
<tr>
<td width="33%">

#### Readiness Scoring
- Multi-factor analysis (CGPA, skills, experience)
- Weighted scoring algorithm
- Trend-based predictions
- Actionable recommendations

</td>
<td width="33%">

#### Skill Gap Analysis
- Company requirement matching
- Competency assessment
- Learning path generation
- Resource mapping

</td>
<td width="33%">

#### Smart Matching
- Student-company compatibility
- Role suitability scoring
- Historical success patterns
- Personalized suggestions

</td>
</tr>
</table>

---

## Analytics Dashboard

<details>
<summary><b>Available Metrics & Reports</b></summary>

### Placement Statistics
- **Overall Rate**: Placed vs Total Students
- **Department Breakdown**: CSE, ECE, EEE, ME performance
- **Company Analysis**: Drives, offers, acceptance rates
- **Timeline View**: Month-wise placement trends

### Compensation Analysis
- **CTC Distribution**: Histogram and percentile views
- **Range Analysis**: Min, Max, Median, Average
- **Company Comparison**: Offer packages across companies
- **Department Benchmarks**: Average CTC by department

### Student Insights
- **CGPA Correlation**: Academic performance vs placement
- **Skill Mapping**: In-demand vs acquired skills
- **Application Success**: Conversion rates by stage
- **Interview Performance**: Round-wise success metrics

### Export Formats
- JSON (Raw data)
- CSV (Spreadsheet compatible)
- PDF (Formatted reports)
- Excel (Advanced analytics)

</details>

---

## Project Structure
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

```plaintext
APT/
├── client/                     # Frontend Application
│   ├── src/
<<<<<<< HEAD
│   │   ├── components/         # Atomic UI & Layout components
│   │   ├── context/            # Auth, Theme, & Global State
│   │   ├── pages/
│   │   │   ├── admin/          # High-fidelity Admin Views
│   │   │   └── student/        # Personalized Student Views
│   │   ├── services/           # API Abstraction & AI Utils
│   │   └── App.jsx             # Route Guarding & Orchestration
│   └── public/                 # Static Assets & Global Styles
│
├── server/                     # Backend Logic
│   ├── controllers/            # Business Logic & Data Handling
│   ├── models/                 # Mongoose Data Schemas (13 Entities)
│   ├── routes/                 # Express API Definitions (15 Routes)
│   ├── services/               # Internal AI & Cloud Integration
│   └── data/                   # Seed Scripts & Raw Data
└── README.md                   # System Documentation
=======
│   │   ├── assets/             # Images and global resources
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── loading/        # Loading skeletons
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── context/            # Global state (AuthContext)
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Views
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── AdminAnalytics.jsx
│   │   │   │   └── ...
│   │   │   ├── student/        # Student Views
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PlacementDrives.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── ...
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── tests/              # Frontend Unit Tests (Vitest)
│   │   │   ├── components/     # Component Tests
│   │   │   └── pages/          # Page/Integration Tests
│   │   ├── App.jsx             # Main Routing
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Frontend environment variables
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Styling configuration
│   └── vite.config.js          # Build & Test configuration
│
├── server/                     # Backend (Node.js + Express)
│   ├── controllers/            # Logic for handling requests
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── User.js
│   │   ├── PlacementDrive.js
│   │   ├── Notification.js
│   │   ├── Application.js
│   │   └── ...
│   ├── routes/                 # API Route Definitions
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── ...
│   ├── middleware/             # Auth & Error handling middleware
│   ├── tests/                  # Backend Tests
│   │   ├── jest/               # Jest Test Suite
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   └── services/
│   │   └── vitest/             # Vitest Test Suite (Alternative)
│   ├── .env                    # Backend environment variables
│   ├── jest.config.js          # Jest configurations
│   ├── vitest.config.js        # Vitest configurations
│   ├── package.json            # Backend dependencies
│   └── server.js               # Server entry point
│
├── .gitignore
├── README.md                   # Project Documentation
└── docker-compose.yml          # Container orchestration (optional)
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3
```

---

<<<<<<< HEAD
## 📡 API Documentation

APT exposes a robust REST API for cross-platform integration.

| Resource | Methods | Endpoint | Description |
|----------|---------|----------|-------------|
| **Auth** | `POST` | `/api/auth/login` | Session creation with JWT |
| **User** | `GET` | `/api/auth/me` | Current profile retrieval |
| **Student**| `GET` | `/api/student/dashboard` | Main student metric hub |
| **Drives** | `POST`| `/api/admin/drive` | Create drive (Restricted) |
| **Stories**| `POST`| `/api/experiences` | Share interview story |
| **Ticker** | `PUT` | `/api/ticker/:id`| Toggle live message status |
| **Analytics**|`GET`| `/api/reports/analytics`| Fetch system-wide metrics |
=======
## Testing Strategy

Comprehensive testing ensures application reliability, security, and performance.

### 🧪 Frontend Testing (Vitest + React Testing Library)
Located in `client/src/tests/`

- **Component Tests**: Verifies individual UI components (e.g., `Navbar`, `SkillProgress`, `CompanyLogo`).
- **Page Tests**: Tests full page interactions and flows (e.g., `Login`, `Register`).
- **Interaction Testing**: Simulates user events (clicks, inputs) using `@testing-library/user-event`.

**Run Frontend Tests:**
```bash
cd client
npm run test        # Run tests in watch mode
# OR
npm run test:vitest # Run tests once
```

### 🧬 Backend Testing (Jest + Supertest)
Located in `server/tests/`

- **Unit Tests**:
  - **Controllers**: Tests API endpoints logic (e.g., `authController`, `studentController`).
  - **Models**: Validates Mongoose schema rules and custom methods (e.g., `User.js`).
  - **Middleware**: Verifies authentication and error handling (e.g., `auth.js`).
- **Integration Tests**: Uses `supertest` to test API routes end-to-end.

**Run Backend Tests:**
```bash
cd server
npm run test:jest   # Run Jest test suite
# OR
npm run test:vitest # Run Vitest test suite
```
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js**: v16.0 or higher
- **Database**: MongoDB Atlas instance
- **Cloud Storage**: Supabase account (for file uploads)

### 2. Quick Start
```bash
<<<<<<< HEAD
git clone https://github.com/Team8-Synapse/APT.git
cd APT

# Install and build all environments
npm run install:all
```

### 3. Environment Config
Place a `.env` in the `/server` directory:
=======
Node.js >= 16.0.0
npm >= 8.0.0
MongoDB (Local or Atlas)
Git
```

### Quick Start

```bash
# Clone repository
git clone https://github.com/Team8-Synapse/APT.git
cd APT

# Install dependencies
npm run install:all

# Setup environment variables
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Start development servers
npm run dev

# Application URLs
# Frontend: http://localhost:5173
# Backend:  http://localhost:5005
```

### Manual Setup

<details>
<summary><b>Step-by-Step Instructions</b></summary>

#### Backend Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5005
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
MONGO_URI=your-mongodb-uri
OPENROUTER_API_KEY=your-openrouter-key
CORS_ORIGIN=http://localhost:5173
EOF

# Start backend
npm run start
```

#### Frontend Setup

```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5005/api
VITE_APP_NAME=Amrita Placement Tracker
EOF

# Start frontend
npm run dev
```

</details>

---

## API Documentation

### Authentication Endpoints

```http
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # User login
GET    /api/auth/me              # Get current user
POST   /api/auth/logout          # Logout user
```

### Student Endpoints

```http
GET    /api/students             # Get all students (Admin)
GET    /api/students/:id         # Get student by ID
PUT    /api/students/:id         # Update student
DELETE /api/students/:id         # Delete student (Admin)
POST   /api/students/bulk        # Bulk upload (Admin)
GET    /api/students/stats       # Student statistics
```

### Drive Endpoints

```http
GET    /api/drives               # Get all drives
GET    /api/drives/:id           # Get drive by ID
POST   /api/drives               # Create drive (Admin)
PUT    /api/drives/:id           # Update drive (Admin)
DELETE /api/drives/:id           # Delete drive (Admin)
GET    /api/drives/eligible      # Get eligible drives (Student)
```

### Application Endpoints

```http
GET    /api/applications         # Get all applications
POST   /api/applications         # Apply to drive
PUT    /api/applications/:id     # Update application status
GET    /api/applications/student/:id  # Get student applications
GET    /api/applications/drive/:id    # Get drive applications
```

### Analytics Endpoints

```http
GET    /api/analytics/overview   # Overall statistics
GET    /api/analytics/department # Department-wise stats
GET    /api/analytics/company    # Company-wise stats
GET    /api/analytics/trends     # Placement trends
GET    /api/analytics/export     # Export reports
```

---

## Deployment Guide

### Production Build

```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build

# Deploy to server
npm run deploy
```

### Environment Configuration

>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3
```env
PORT=5005
<<<<<<< HEAD
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=secure_hex_key
SUPABASE_URL=cloud_endpoint
SUPABASE_SERVICE_KEY=cloud_key
```

### 4. Launch
```bash
# Production Launch
cd server && npm start

# Development with Hot-Reload
cd client && npm run dev
```

---

## 🤝 Team & Contribution
=======
MONGO_URI=production-db-url
JWT_SECRET=strong-secret-key
OPENROUTER_API_KEY=production-key
ALLOWED_ORIGINS=https://placement.amrita.edu
```

---

## Contributing

We welcome contributions from the community!

<details>
<summary><b>Contribution Guidelines</b></summary>

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Review Process

- All PRs require review from maintainers
- Tests must pass
- Code must follow style guidelines
- Documentation must be updated

</details>

---

## Team

<div align="center">

**Developed by Team 8**
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

**Managed by Team 8**
*Amrita Vishwa Vidyapeetham*

<<<<<<< HEAD
We welcome community feedback and contributions! Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting Pull Requests.
=======
**Project Supervisor**: [Supervisor Name]  
**Academic Year**: 2025-2026  
**Course**: Final Year Project

### Contributors

[View All Contributors](https://github.com/Team8-Synapse/APT/graphs/contributors)

</div>
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3

---

**© 2026 Amrita Placement Tracker | Built for Excellence**

<<<<<<< HEAD
![Footer](https://raw.githubusercontent.com/andreasbm/rainbow-line/master/line.png)
=======
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

For support, email: support@placement.amrita.edu

<div align="center">

### Quick Links

[Documentation](docs/) • [Issues](https://github.com/your-org/amrita-placement-tracker/issues) • [Discussions](https://github.com/your-org/amrita-placement-tracker/discussions)

---

**Built with precision. Powered by innovation. Designed for success.**

![Footer](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**© 2026 Amrita Placement Tracker | Team 8**

</div>
>>>>>>> 204f756f82dcc2552b35117a4900d6872d977ab3
