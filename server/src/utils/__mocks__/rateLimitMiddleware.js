const mockRateLimit = jest.fn().mockImplementation(() => {
    return (req, res, next) => next();
});

module.exports = mockRateLimit;