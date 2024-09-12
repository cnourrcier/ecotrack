module.exports = {
    env: {
        node: true, // Server-side (Node.js) environment
        es2021: true, // ECMAScript 2021 features
    },
    parserOptions: {
        ecmaVersion: 2021, // Set ECMAScript version for latest JS features
        sourceType: 'script', // Treat files as scripts (CommonJS)
    },
    extends: [
        'eslint:recommended', // ESLint's recommended rules
    ],
    rules: {
        // Server-specific rules
        'no-console': 'off', // Allow console logs for server-side
        'no-process-exit': 'error', // Disallow process.exit() in server code
    },
};