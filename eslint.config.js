export default [
    {
      ignores: ["node_modules/", "dist/"],
    },
    {
      files: ["**/*.js"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
        "semi": ["error", "always"],
      },
    },
  ];
  