const supportedBrowsers = require("./supported-browsers");

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          browsers: supportedBrowsers
        },
        modules: false,
        loose: true,
        debug: true
      }
    ]
  ],
  plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]]
};
