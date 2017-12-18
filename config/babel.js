const supportedBrowsers = require("./supported-browsers");

module.exports = {
  presets: [
    ["stage-3"],
    [
      "env",
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
  plugins: [
    "transform-class-properties"
  ]
};
