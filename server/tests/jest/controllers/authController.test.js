const authController = require('../../../controllers/authController');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

// Mock User model
jest.mock('../../../models/User');
// Mock jwt
jest.mock('jsonwebtoken');

const mockRequest = (body) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req = mockRequest({ email: 'new@example.com', password: 'pass', role: 'student' });

            // Mock Mongoose save method
            // Since we do 'const user = new User(...)', we need to mock the implementation of User
            const saveMock = jest.fn().mockResolvedValue(true);
            User.mockImplementation(() => ({
                _id: 'newUserId',
                save: saveMock
            }));

            jwt.sign.mockReturnValue('newToken');

            await authController.register(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                token: 'newToken'
            }));
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            req = mockRequest({ email: 'valid@example.com', password: 'password123' });

            const mockUser = {
                _id: 'userId',
                email: 'valid@example.com',
                role: 'student',
                password: 'hashedPass',
                isLocked: false,
                comparePassword: jest.fn().mockResolvedValue(true),
                save: jest.fn().mockResolvedValue(true),
                failedAttempts: 0
            };

            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('validToken');

            await authController.login(req, res);

            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                token: 'validToken'
            }));
        });

        it('should return 401 if user not found', async () => {
            req = mockRequest({ email: 'notfound@example.com', password: 'any' });
            User.findOne.mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 401 and increment failed attempts on invalid password', async () => {
            req = mockRequest({ email: 'valid@example.com', password: 'wrong' });

            const mockUser = {
                role: 'student',
                failedAttempts: 0,
                comparePassword: jest.fn().mockResolvedValue(false),
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.login(req, res);

            expect(mockUser.failedAttempts).toBe(1);
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should lock admin account after 5 failed attempts', async () => {
            req = mockRequest({ email: 'admin@example.com', password: 'wrong' });

            const mockUser = {
                role: 'admin',
                failedAttempts: 4,
                isLocked: false,
                comparePassword: jest.fn().mockResolvedValue(false),
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.login(req, res);

            expect(mockUser.failedAttempts).toBe(5);
            expect(mockUser.isLocked).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
        });
    });
});
