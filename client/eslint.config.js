import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';

export default [
    js.configs.recommended,
    eslintConfigPrettier,
    react.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        rules: {
            // React-specific rules
        },
    },
];