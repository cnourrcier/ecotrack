const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

jest.mock('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
});

describe('Auth Middleware', () => {
    describe('verifyToken', () => {
        it('should set req.user for valid token', async () => {
            const user = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
            const token = 'valid_token';
            jwt.verify.mockImplementation(() => ({ userId: user._id }));

            const req = { cookies: { token } };
            const res = {};
            const next = jest.fn();

            await verifyToken(req, res, next);

            expect(req.user).toBeDefined();
            expect(req.user).not.toBeNull();
            expect(req.user._id.toString()).toBe(user._id.toString());
            expect(next).toHaveBeenCalled();
        });

        it('should set req.user to null for invalid token', async () => {
            const token = 'invalidtoken';

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(new Error('Invalid token'));
            });

            const req = { cookies: { token } };
            const res = {};
            const next = jest.fn();

            await verifyToken(req, res, next);

            expect(req.user).toBeNull();
            expect(next).toHaveBeenCalled();
        });

        it('should set req.user to null when no token is provided', async () => {
            const req = { cookies: {} };
            const res = {};
            const next = jest.fn();

            await verifyToken(req, res, next);

            expect(req.user).toBeNull();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('requireAuth', () => {
        it('should call next() if req.user is set', () => {
            const req = { user: { _id: 'someuserId' } };
            const res = {};
            const next = jest.fn();

            requireAuth(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if req.user is not set', () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            requireAuth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Authentication required',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    // Integration tests
    describe('Protected Route', () => {
        it('should allow access to dashboard with valid token', async () => {
            const user = await User.create({
                username: 'dashboarduser',
                email: 'dashboard@example.com',
                password: 'password123',
            });
            const token = 'valid_token';

            jwt.verify.mockImplementation(() => ({ userId: user._id }));

            const res = await request(app)
                .get('/api/dashboard')
                .set('Cookie', [`token=${token}`]);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Welcome to your dashboard',
            );
        });

        it('should deny access to dashboard without token', async () => {
            const res = await request(app).get('/api/dashboard');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty(
                'message',
                'Authentication required',
            );
        });
    });
});
