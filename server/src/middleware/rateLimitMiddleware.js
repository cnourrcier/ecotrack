const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, errorMessage) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: errorMessage,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            res.status(429).json({
                error: errorMessage,
                message: options.message,
                retryAfter: Math.ceil(windowMs / 1000),
            });
        },
    });
};

const passwordResetLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // Limit each IP to 3 requests per windowMs
    'Too many password reset attempts, please try again after 15 minutes.',
);

const loginLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // Limit each IP to 5 login requests per windowMs
    'Too many login attempts, please try again after 15 minutes.',
);

module.exports = {
    createRateLimiter,
    passwordResetLimiter,
    loginLimiter,
};
