const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
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
    await User.deleteMany({});
});

describe('Authentication Controller', () => {
    describe('POST /api/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
        });

        it('should not register a user with an existing email', async () => {
            await User.create({ username: 'existinguser', email: 'existing@example.com', password: 'password123' });
            const res = await request(app)
                .post('/api/register')
                .send({
                    username: 'newuser',
                    email: 'existing@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/login', () => {
        it('should login a user with correct credentials', async () => {
            await User.create({ username: 'loginuser', email: 'login@example.com', password: 'password123' });
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged in successfully');
            expect(res.body).toHaveProperty('user');
        });

        it('should not login a user with incorrect credentials', async () => {
            await User.create({ username: 'loginuser', email: 'login@example.com', password: 'password123' });
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });
    });

    describe('POST /api/reset-password-request', () => {
        beforeEach(async () => {
            await User.deleteMany({})
        })
        it('should send a password reset email for an existing user', async () => {
            await User.create({ username: 'resetuser', email: 'reset@example.com', password: 'password123' });
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({
                    email: 'reset@example.com'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Password reset email sent');

            expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
                email: 'reset@example.com',
                subject: 'EcoTrack Password Reset'
            }));
        });

        it('should not send a password reset email for a non-existing user', async () => {
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({
                    email: 'nonexistent@example.com'
                });
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });
});