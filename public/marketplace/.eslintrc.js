module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "globals": {
        "bootstrap": "readonly",
        "Chart": "readonly"
    },
    "rules": {
        // Désactiver les règles problématiques pour du JS frontend
        "no-undef": "off",
        "no-unused-vars": "warn"
    }
};
