module.exports = [
    {
        files: ["**/*.js", "**/*.jsx"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                window: true,
                document: true,
            },
        },
        plugins: {
            react: require("eslint-plugin-react"),
            prettier: require("eslint-plugin-prettier"),
        },
        rules: {
            "prettier/prettier": "error",
            "react/prop-types": "off",
        },
    },
];