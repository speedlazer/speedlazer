module.exports = {
  env: {
    browser: true,
    es6: true
  },
  plugins: ["compat", "prettier"],
  extends: ["eslint:recommended", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "prettier/prettier": "error",
    "compat/compat": "error"
  },
  globals: {
    Game: false,
    Crafty: false,
    WhenJS: false
  }
};
