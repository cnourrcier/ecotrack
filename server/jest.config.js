const path = require('path');

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: [path.join(__dirname, './jest.setup.js')],
    rootDir: './src', // Specify the root directory for tests
};
