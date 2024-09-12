module.exports = [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "script",
            globals: {
                process: true,
                __dirname: true,
            },
        },
        plugins: {
            prettier: require("eslint-plugin-prettier"),
        },
        rules: {
            "no-console": "off",
            "prettier/prettier": "error",
        },
    },
];
