const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const {
    passwordResetLimiter,
    loginLimiter,
} = require('../middleware/rateLimitMiddleware');

jest.mock('../middleware/rateLimitMiddleware');
jest.mock('../utils/sendEmail');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
});

describe('Rate Limit Middleware', () => {
    // Test rate limiting for login attempts
    it('should handle rate limiting for login attempts', async () => {
        await User.create({
            username: 'loginuser',
            email: 'login@example.com',
            password: 'password123',
        });

        // Mock the rate limiter to allow 5 requests and then block
        loginLimiter.mockImplementation((req, res, next) => {
            if (loginLimiter.mock.calls.length > 5) {
                return res.status(429).json({
                    message: 'Too many login attempts, please try again later.',
                });
            }
            next();
        });

        // Make 6 login attempts
        for (let i = 0; i < 6; i++) {
            const res = await request(app)
                .post('/api/login')
                .send({ email: 'login@example.com', password: 'password123' });

            if (i < 5) {
                expect(res.statusCode).toBe(200);
            } else {
                expect(res.statusCode).toBe(429);
                expect(res.body).toHaveProperty(
                    'message',
                    'Too many login attempts, please try again later.',
                );
            }
        }
    });

    // Test successful rate limiting for password requests
    it('should handle rate limiting for password reset requests', async () => {
        const user = await User.create({
            username: 'ratelimituser',
            email: 'ratelimit@example.com',
            password: 'password123',
        });

        // Mock the rate limiter to allow 5 requests and then block
        passwordResetLimiter.mockImplementation((req, res, next) => {
            if (passwordResetLimiter.mock.calls.length > 5) {
                return res.status(429).json({
                    message: 'Too many requests, please try again later.',
                });
            }
            next();
        });

        // Make 6 requests
        for (let i = 0; i < 6; i++) {
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({ email: 'ratelimit@example.com' });

            if (i < 5) {
                expect(res.statusCode).toBe(200);
            } else {
                expect(res.statusCode).toBe(429);
                expect(res.body).toHaveProperty(
                    'message',
                    'Too many requests, please try again later.',
                );
            }
        }
    });
});
