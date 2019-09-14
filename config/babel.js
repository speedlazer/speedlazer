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
        useBuiltIns: "usage"
      }
    ]
  ],
  plugins: [
    ["@babel/plugin-transform-react-jsx", { pragma: "h" }],
    "@babel/proposal-class-properties"
  ]
};
