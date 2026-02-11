# System Architecture - Amrita Placement Tracker

## Technologies Used (MERN Stack)
- **MongoDB**: NoSQL database for flexible data storage (Students, Drives, Applications).
- **Express.js**: Backend framework for building RESTful APIs.
- **React.js**: Frontend library for building dynamic user interfaces.
- **Node.js**: Runtime environment for executing JavaScript on the server.

## Folder Structure
### Client (`/client`)
- `src/components`: Reusable UI components (Navbar, Cards, Modals).
- `src/pages`: Page views (Login, Dashboard, Profile).
- `src/context`: React Context for state management (AuthContext).
- `src/utils`: Helper functions (API calls, formatters).

### Server (`/server`)
- `models`: Mongoose schemas (User, StudentProfile, PlacementDrive).
- `routes`: API route definitions.
- `controllers`: logic for handling requests.
- `middleware`: Authentication and error handling.
- `config`: Database connection and environment setup.

## Data Flow
1. **User Interaction**: Student interacts with the React frontend.
2. **API Request**: Frontend sends HTTP request (Axios) to Express backend.
3. **Authentication**: JWT middleware verifies user identity.
4. **Data Processing**: Controller validates input and queries MongoDB.
5. **Response**: Server sends JSON response back to the client.
6. **UI Update**: React updates the DOM based on the new data.

## Security Architecture
- **JWT (JSON Web Tokens)**: Used for stateless authentication.
- **Bcrypt**: Used for hashing passwords before storage.
- **Environment Variables**: Sensitive keys (DB URI, JWT Secret) stored in `.env`.
