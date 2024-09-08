const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
            message: 'Logged in successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

exports.dashboard = (req, res) => {
    res.json({ message: 'You have access to the dashboard', user: req.user });
};

exports.profile = async (req, res) => {
    res.json({ message: 'You have access to the profile', user: req.user });
};

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        setAccessTokenCookie(res, accessToken);

        res.json({ message: 'Token refreshed successfully' });
    });
};

exports.checkAuth = async (req, res) => {
    if (!req.user) {
        return res.json({ user: null });
    }
    res.json({ user: req.user });
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
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: validationErrors.join(', ') });
    } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ error: `${field} already exists` });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
}

function generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
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