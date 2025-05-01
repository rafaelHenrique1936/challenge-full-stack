module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended", "plugin:jest/recommended", "prettier"],
  plugins: ["jest", "prettier"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "node/no-unpublished-require": [
      "error",
      {
        allowModules: ["supertest"],
      },
    ],
  },
}
