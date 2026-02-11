# Security Checklist

## Authentication & Authorization
- [x] **JWT Implementation**: Secure token generation for user sessions.
- [x] **Password Hashing**: Bcrypt used to hash passwords before database storage.
- [x] **Role-Based Access Control (RBAC)**: Distinct routes for Admin and Student.
- [x] **Token Expiry**: Tokens have a set expiration time (e.g., 2 hours).

## Data Protection
- [x] **Environment Variables**: Secrets (DB URI, Keys) are not hardcoded.
- [x] **Input Validation**: API requests are validated to prevent injection.
- [x] **MongoDB Security**: Database access is restricted via IP whitelist and strong credentials.

## API Security
- [x] **CORS Configuration**: Restricted to trusted frontend domains (`localhost:5173`).
- [x] **Error Handling**: Generic error messages in production to avoid leaking stack traces.

## Future Improvements
- [ ] Implement Rate Limiting.
- [ ] Add 2FA (Two-Factor Authentication).
- [ ] Enable HTTPS in production.
