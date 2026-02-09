const jwt = require('jsonwebtoken');
const { auth, authorize } = require('../../../middleware/auth');
const User = require('../../../models/User');

jest.mock('jsonwebtoken');
jest.mock('../../../models/User');

const mockRequest = () => {
    const req = {};
    req.header = jest.fn().mockReturnValue('Bearer validtoken');
    req.user = {};
    return req;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('Auth Middleware (Jest)', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext;
        jest.clearAllMocks();
    });

    describe('auth', () => {
        it('should call next if token is valid and user exists', async () => {
            const decodedToken = { _id: 'user123' };
            const mockUser = { _id: 'user123', role: 'student' };

            jwt.verify.mockReturnValue(decodedToken);
            User.findOne.mockResolvedValue(mockUser);

            await auth(req, res, next);

            expect(jwt.verify).toHaveBeenCalled();
            expect(User.findOne).toHaveBeenCalledWith({ _id: 'user123' });
            expect(req.token).toBe('validtoken');
            expect(req.user).toBe(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', async () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await auth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ error: 'Please authenticate.' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 if user not found', async () => {
            const decodedToken = { _id: 'user123' };
            jwt.verify.mockReturnValue(decodedToken);
            User.findOne.mockResolvedValue(null);

            await auth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        it('should call next if user has correct role', () => {
            req.user = { role: 'admin' };
            const middleware = authorize('admin', 'student');
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user does not have correct role', () => {
            req.user = { role: 'student' };
            const middleware = authorize('admin');
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ error: 'Access denied.' });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
