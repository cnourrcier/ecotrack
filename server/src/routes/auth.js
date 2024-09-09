const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');


const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', rateLimitMiddleware.loginLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/reset-password-request', rateLimitMiddleware.passwordResetLimiter, authController.resetPasswordRequest);
router.post('/reset-password-confirm', authController.resetPasswordConfirm);

// Apply verifyToken middleware to all routes below this point
router.use(authMiddleware.verifyToken);

// Routes that use authentication if available
router.get('/check-auth', authController.checkAuth)

// Protected routes
router.get('/dashboard', authMiddleware.requireAuth, authController.dashboard);
router.get('/profile', authMiddleware.requireAuth, authController.profile);

module.exports = router;
