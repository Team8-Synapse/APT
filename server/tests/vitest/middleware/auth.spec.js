import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('jsonwebtoken', () => {
    return {
        default: {
            verify: vi.fn(),
            sign: vi.fn()
        },
        verify: vi.fn(),
        sign: vi.fn()
    };
});

const mockUser = {
    _id: 'user123',
    role: 'student'
};

const mockUserModel = {
    findOne: vi.fn()
};

vi.mock('mongoose', () => {
    const models = {};
    return {
        default: {
            Schema: vi.fn(),
            model: vi.fn((name) => {
                return mockUserModel;
            }),
            models: models
        }
    };
});

// Import middleware AFTER mocking
import { auth, authorize } from '../../../middleware/auth.js';

const mockRequest = () => {
    const req = {};
    req.header = vi.fn().mockReturnValue('Bearer validtoken');
    req.user = {};
    return req;
};

const mockResponse = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    return res;
};

const mockNext = vi.fn();

describe('Auth Middleware (Vitest)', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext;
        vi.clearAllMocks();
        console.log('JWT inside test:', jwt);
    });

    describe('auth', () => {
        it('should call next if token is valid and user exists', async () => {
            const decodedToken = { _id: 'user123' };

            jwt.verify.mockReturnValue(decodedToken);
            mockUserModel.findOne.mockResolvedValue(mockUser);

            await auth(req, res, next);

            console.log('findOne calls:', mockUserModel.findOne.mock.calls);
            console.log('jwt calls:', jwt.verify.mock.calls);

            expect(jwt.verify).toHaveBeenCalled();
            expect(mockUserModel.findOne).toHaveBeenCalled();
            expect(req.token).toBe('validtoken');
            expect(req.user).toEqual(mockUser);
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
            mockUserModel.findOne.mockResolvedValue(null);

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
