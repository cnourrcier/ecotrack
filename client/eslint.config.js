const babelParser = require('@babel/eslint-parser');

module.exports = [
    {
        files: ['**/*.js', '**/*.jsx'],
        ignores: ['node_modules/**'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: babelParser,
            globals: {
                window: true,
                document: true,
            },
        },
        plugins: {
            react: require('eslint-plugin-react'),
        },
        rules: {
            'react/prop-types': 'off',
        },
        settings: {
            react: {
                version: 'detect', // Automatically detect React version
            },
        },
    },
];
