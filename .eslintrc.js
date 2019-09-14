module.exports = {
  env: {
    browser: true,
    es6: true
  },
  plugins: ["compat", "prettier", "react", "babel"],
  extends: ["eslint:recommended", "prettier", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  settings: {
    react: {
      pragma: "h",
      version: "15.6"
    }
  },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    "prettier/prettier": "error",
    "compat/compat": "error",
    "react/no-unknown-property": ["error", { ignore: ["class", "for"] }],
    "react/prop-types": "off",
    "react/display-name": "off"
  },
  globals: {
    Game: false,
    Crafty: false,
    WhenJS: false
  }
};
