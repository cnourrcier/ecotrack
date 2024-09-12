import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    eslintConfigPrettier,
    {
        files: ['**/*.js'],
        rules: {
            // Node.js-specific rules
        },
    },
];