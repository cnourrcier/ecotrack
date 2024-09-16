const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

jest.mock('../utils/sendEmail');
jest.mock('jsonwebtoken');

let mongoServer;

// Set up MongoDB Memory Server before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
        instance: {
            dbName: 'authControllerTest',
        },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}, 30000); // timeout 30 seconds

// Clean up after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Clear users before each test
beforeEach(async () => {
    await User.deleteMany({});
});

describe('Authentication Controller', () => {
    describe('POST /api/register', () => {
        // Test successful user registration
        it('should register a new user', async () => {
            const res = await request(app).post('/api/register').send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty(
                'message',
                'User registered successfully',
            );
        });

        // Test registration with existing email
        it('should not register a user with an existing email', async () => {
            await User.create({
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123',
            });
            const res = await request(app).post('/api/register').send({
                username: 'newuser',
                email: 'existing@example.com',
                password: 'password123',
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should not register a user with invalid email format', async () => {
            const res = await request(app).post('/api/register').send({
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123',
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should not register a user with a short password', async () => {
            const res = await request(app).post('/api/register').send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'short',
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/login', () => {
        // Test successful login
        it('should login a user with correct credentials', async () => {
            await User.create({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123',
            });
            const res = await request(app).post('/api/login').send({
                email: 'login@example.com',
                password: 'password123',
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Logged in successfully',
            );
            expect(res.body).toHaveProperty('user');
        });

        // Test login with incorrect credentials
        it('should not login a user with incorrect credentials', async () => {
            await User.create({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123',
            });
            const res = await request(app).post('/api/login').send({
                email: 'login@example.com',
                password: 'wrongpassword',
            });
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should handle server errors during login', async () => {
            jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app).post('/api/login').send({
                email: 'error@example.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Login failed');
        });
    });

    describe('POST /api/logout', () => {
        it('should clear cookies and log out the user', async () => {
            const res = await request(app).post('/api/logout');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Logged out successfully',
            );
            expect(res.headers['set-cookie']).toBeDefined();
            expect(
                res.headers['set-cookie'].some((cookie) =>
                    cookie.startsWith('token=;'),
                ),
            ).toBe(true);
            expect(
                res.headers['set-cookie'].some((cookie) =>
                    cookie.startsWith('refreshToken=;'),
                ),
            ).toBe(true);
        });
    });

    describe('POST /api/refresh-token', () => {
        it('should refresh the access token with a valid refresh token', async () => {
            const user = await User.create({
                username: 'refreshuser',
                email: 'refresh@example.com',
                password: 'password123',
            });
            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
            );

            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(null, { userId: user._id });
            });

            const res = await request(app)
                .post('/api/refresh-token')
                .set('Cookie', [`refreshToken=${refreshToken}`]);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Token refreshed successfully',
            );
            expect(res.headers['set-cookie']).toBeDefined();
            expect(
                res.headers['set-cookie'].some((cookie) =>
                    cookie.startsWith('token='),
                ),
            ).toBe(true);
        });

        it('should return 403 for missing refresh token', async () => {
            const res = await request(app).post('/api/refresh-token');
            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty(
                'message',
                'Refresh token not provided',
            );
        });

        it('should return 403 for invalid refresh token', async () => {
            jwt.verify.mockImplementationOnce((token, secret, callback) => {
                callback(new Error('Invalid token'));
            });

            const res = await request(app)
                .post('/api/refresh-token')
                .set('Cookie', ['refreshToken=invalidtoken']);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Invalid refresh token');
        });
    });

    describe('POST /api/reset-password-request', () => {
        beforeEach(async () => {
            await User.deleteMany({});
        });
        // Test successful password reset request
        it('should send a password reset email for an existing user', async () => {
            await User.create({
                username: 'resetuser',
                email: 'reset@example.com',
                password: 'password123',
            });
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({
                    email: 'reset@example.com',
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset email sent',
            );

            expect(sendEmail).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'reset@example.com',
                    subject: 'EcoTrack Password Reset',
                }),
            );
        });

        // Test password reset request for non-existing user
        it('should not send a password reset email for a non-existing user', async () => {
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({
                    email: 'nonexistent@example.com',
                });
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });

        // Verify resetPasswordToken and resetPasswordExpires are set correctly
        it('should set resetPasswordToken and resetPasswordExpires when requesting password reset', async () => {
            const user = await User.create({
                username: 'resetuser',
                email: 'reset@example.com',
                password: 'password123',
            });
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({
                    email: 'reset@example.com',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset email sent',
            );

            const updatedUser = await User.findById(user._id);

            expect(updatedUser.resetPasswordToken).toBeDefined();
            expect(updatedUser.resetPasswordExpires).toBeDefined();
            expect(updatedUser.resetPasswordExpires).toBeInstanceOf(Date);
            expect(updatedUser.resetPasswordExpires.getTime()).toBeGreaterThan(
                Date.now(),
            );
        });

        // Test for multiple reset requests
        it('should update resetPasswordToken and resetPasswordExpires on multiple reset requests for the same user', async () => {
            // Create a user
            const user = await User.create({
                username: 'resetuser',
                email: 'reset@example.com',
                password: 'password123',
            });

            // First request
            const res1 = await request(app)
                .post('/api/reset-password-request')
                .send({ email: 'reset@example.com' });

            expect(res1.statusCode).toBe(200);
            expect(res1.body).toHaveProperty(
                'message',
                'Password reset email sent',
            );

            const updatedUser1 = await User.findById(user._id);
            const firstToken = updatedUser1.resetPasswordToken;
            const firstExpires = updatedUser1.resetPasswordExpires;

            // Wait a short time to ensure a different timestamp
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Second request for the same user
            const res2 = await request(app)
                .post('/api/reset-password-request')
                .send({ email: 'reset@example.com' });

            expect(res2.statusCode).toBe(200);
            expect(res2.body).toHaveProperty(
                'message',
                'Password reset email sent',
            );

            const updatedUser2 = await User.findById(user._id);
            const secondToken = updatedUser2.resetPasswordToken;
            const secondExpires = updatedUser2.resetPasswordExpires;

            // Assertions
            expect(firstToken).toBeDefined();
            expect(secondToken).toBeDefined();
            expect(secondToken).not.toBe(firstToken);

            expect(firstExpires).toBeDefined();
            expect(secondExpires).toBeDefined();
            expect(firstExpires).toBeInstanceOf(Date);
            expect(secondExpires).toBeInstanceOf(Date);
            expect(secondExpires.getTime()).toBeGreaterThan(
                firstExpires.getTime(),
            );

            // Check that tokens are not present in the password field
            expect(updatedUser2.password).not.toContain(secondToken);

            // Verify that original user didn't have these fields
            expect(user.resetPasswordToken).toBeUndefined();
            expect(user.resetPasswordExpires).toBeUndefined();
        });

        it('should not update resetPasswordToken for non-existent user', async () => {
            const res = await request(app)
                .post('/api/reset-password-request')
                .send({ email: 'nonexistent@example.com' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('POST /api/reset-password-confirm', () => {
        let user;
        let resetToken;

        beforeEach(async () => {
            await User.deleteMany({});

            // Create a user and generate a reset token
            resetToken = 'validresettoken123';
            user = await User.create({
                username: 'resetuser',
                email: 'reset@example.com',
                password: 'oldpassword123',
                resetPasswordToken: resetToken,
                resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
            });

            await user.save();
        });

        it('should reset password with valid token', async () => {
            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken,
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty(
                'message',
                'Password has been reset',
            );

            // Verify that the password has been changed
            const updatedUser = await User.findById(user._id);
            expect(await updatedUser.isValidPassword('newpassword123')).toBe(
                true,
            );
            expect(updatedUser.resetPasswordToken).toBeUndefined();
            expect(updatedUser.resetPasswordExpires).toBeUndefined();
        });

        it('should not reset password with invalid token', async () => {
            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: 'invalidtoken',
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset token is invalid or has expired',
            );
        });

        it('should not reset password with expired token', async () => {
            // Set token to expired
            user.resetPasswordExpires = Date.now() - 3600000; // 1 hour ago
            await user.save();

            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken,
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset token is invalid or has expired',
            );
        });

        // Test for case sensitivity in token
        it('should be case-sensitive for reset token', async () => {
            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken.toUpperCase(), // Using uppercase version
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset token is invalid or has expired',
            );
        });

        // Test for token reuse
        it('should not allow reuse of reset token', async () => {
            // First reset
            await request(app).post('/api/reset-password-confirm').send({
                token: resetToken,
                newPassword: 'newpassword123',
            });

            // Attempt second reset with same token
            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken,
                    newPassword: 'anothernewpassword123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset token is invalid or has expired',
            );
        });

        it('should not reset password if user is not found', async () => {
            // Delete the user
            await User.deleteMany({});

            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken,
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty(
                'message',
                'Password reset token is invalid or has expired',
            );
        });

        it('should handle errors gracefully', async () => {
            // Mock a database error
            jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/api/reset-password-confirm')
                .send({
                    token: resetToken,
                    newPassword: 'newpassword123',
                });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty(
                'message',
                'Error in password reset confirmation',
            );
        });
    });
});
