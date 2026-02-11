# Amrita Placement Tracker - API Documentation

## Base URL
All API requests are made to `http://localhost:5005/api` (or environment-specific URL).

## Authentication
- `POST /auth/register` - Register a new user (Student/Admin).
- `POST /auth/login` - Authenticate user and receive JWT.

## Student Endpoints
- `GET /student/profile` - Fetch logged-in student's profile.
- `PUT /student/profile` - Update student profile details.
- `GET /student/drives` - List all available placement drives.
- `GET /student/applications` - View status of applied drives.

## Admin Endpoints
- `GET /admin/dashboard-stats` - Get overall placement statistics.
- `POST /admin/drive` - Create a new placement drive.
- `GET /admin/students` - List all registered students.
- `PUT /admin/student/:id` - Update student details (e.g., verify documents).

## Alumni Insights
- `GET /alumni` - Fetch inspirational alumni stories.
- `POST /alumni` - Add a new success story (Admin only).

## PrepHub Resources
- `GET /resources` - Get placement preparation materials.
- `GET /experiences` - Read interview experiences shared by seniors.

## Error Handling
- **400**: Bad Request (Missing fields).
- **401**: Unauthorized (Invalid/Missing Token).
- **403**: Forbidden (Access denied).
- **500**: Internal Server Error.
