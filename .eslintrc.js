module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "airbnb-typescript/base", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "lines-between-class-members": "off",
    "@typescript-eslint/lines-between-class-members": "off",
    "no-inferrable-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
  },
};
