const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Need to create this utility
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        handleRegistrationError(error, res);
    }
};

// @desc    Login existing user
// @route   POST /api/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.isValidPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user._id);
        setTokenCookies(res, accessToken, refreshToken);

        const userData = user.toObject();
        delete userData.password;

        res.json({
            user: userData,
            message: 'Logged in successfully',
        });
    } catch (error) {
        if (error.statusCode === 429) {
            return res.status(429).json(error);
        }
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

// @desc    Logout current user
// @route   POST /api/logout
// @access  Public
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get user environmental data
// @route   GET /api/dashboard
// @access  Protected
exports.dashboard = (req, res) => {
    res.json({ message: 'Welcome to your dashboard', user: req.user });
};

// @desc    Get user account data (username, email, etc)
// @route   GET /api/dashboard
// @access  Protected
// *** See notes on dashboard, I think I can remove this API point.
exports.profile = async (req, res) => {
    res.json({ message: 'You have access to the profile', user: req.user });
};

// @desc    Refresh access token if valid refresh token
// @route   POST /api/refresh-token
// @access  Public
exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not provided' });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res
                    .status(403)
                    .json({ message: 'Invalid refresh token' });
            }

            const accessToken = jwt.sign(
                { userId: decoded.userId },
                process.env.JWT_SECRET,
                { expiresIn: '15m' },
            );
            setAccessTokenCookie(res, accessToken);

            res.json({ message: 'Token refreshed successfully' });
        },
    );
};

// @desc    Check if user is authenticated
// @route   GET /api/check-auth
// @access  Public
exports.checkAuth = async (req, res) => {
    if (!req.user) {
        return res.json({ user: null });
    }
    res.json({ user: req.user });
};

// @desc    Request password reset
// @route   POST /api/reset-password-request
// @access  Public
exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // Send email
        let resetUrl;
        switch (process.env.NODE_ENV) {
            case 'development':
            case 'test':
                resetUrl = `${req.protocol}://${process.env.CLIENT_URL}/reset-password/${resetToken}`;
                break;
            case 'production':
                resetUrl = `${req.protocol}://${process.env.PROD_URL}/reset-password/${resetToken}`;
                break;
        }

        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.`;

        await sendEmail({
            email: user.email,
            subject: 'EcoTrack Password Reset',
            message,
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error in password reset request' });
    }
};

// @desc    Confirm password reset
// @route   POST /api/reset-password-confirm
// @access  Public
exports.resetPasswordConfirm = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({
                    message: 'Password reset token is invalid or has expired',
                });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({
            message: 'Error in password reset confirmation',
        });
    }
};

// Helper functions
async function getUserData(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return { id: user._id, username: user.username, email: user.email };
}

function handleRegistrationError(error, res) {
    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message,
        );
        return res.status(400).json({ error: validationErrors.join(', ') });
    } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ error: `${field} already exists` });
    }
    console.error('Registration error:', error);
    res.status(500).json({
        error: 'Registration failed',
        details: error.message,
    });
}

function generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
}

function setTokenCookies(res, accessToken, refreshToken) {
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
}

function setAccessTokenCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
}

function setRefreshTokenCookie(res, token) {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}
