module.exports = {
    env: {
        browser: true, // Client-side environment
        es2021: true,  // ECMAScript 2021 features
    },
    parserOptions: {
        sourceType: 'module', // Ensures ESLint recognizes ES modules
        ecmaVersion: 2021,
    },
    extends: [
        'eslint:recommended', // ESLint's recommended rules
        'plugin:react/recommended',
    ],
    rules: {
        // Client-specific rules
        'no-console': 'warn', // Warn on console logs
    },
};